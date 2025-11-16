import { NextRequest, NextResponse } from 'next/server';
import { initiateMpesaPayment } from '@/lib/payments/mpesa';
import { db, transactions, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, amount, accountReference, description, email, customerName, plan, userId } =
      body;

    // Validate required fields
    if (!phoneNumber || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine tier from plan name
    const tierMap: Record<string, 'creator' | 'pro' | 'agency'> = {
      creator: 'creator',
      pro: 'pro',
      agency: 'agency',
    };
    const tier = tierMap[plan?.toLowerCase()] || 'creator';

    // If userId is provided, verify user exists
    let validUserId = userId;
    if (userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      if (!user) {
        validUserId = null;
      }
    } else if (email) {
      // Try to find user by email
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (existingUser) {
        validUserId = existingUser.id;
      }
    }

    // Get the base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/payments/mpesa/callback`;

    // Initiate STK push
    const response = await initiateMpesaPayment(
      phoneNumber,
      Math.round(amount), // M-Pesa requires whole numbers
      accountReference || 'SUB',
      description || 'ContentForge Subscription',
      callbackUrl
    );

    // Store transaction in database with pending status
    await db.insert(transactions).values({
      userId: validUserId,
      paymentMethod: 'mpesa',
      status: 'pending',
      amount: Math.round(amount),
      currency: 'KSH',
      tier,
      mpesaCheckoutRequestId: response.CheckoutRequestID,
      mpesaMerchantRequestId: response.MerchantRequestID,
      customerEmail: email,
      customerPhone: phoneNumber,
      customerName: customerName,
      metadata: {
        plan,
        accountReference,
        description,
      },
    });

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error: any) {
    console.error('M-Pesa STK push error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to initiate M-Pesa payment',
        ResponseCode: '1',
        ResponseDescription: error.message,
      },
      { status: 500 }
    );
  }
}
