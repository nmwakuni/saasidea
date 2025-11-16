import { NextRequest, NextResponse } from 'next/server';
import { createPesapalPayment } from '@/lib/payments/pesapal';
import { db, transactions, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, firstName, lastName, phoneNumber, plan, userId } = body;

    // Validate required fields
    if (!amount || !email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine tier from plan name
    const tierMap: Record<string, 'creator' | 'pro' | 'agency'> = {
      creator: 'creator',
      pro: 'pro',
      agency: 'agency',
    };
    const tier = tierMap[plan.toLowerCase()] || 'creator';

    // Generate unique merchant reference
    const merchantReference = `SUB-${plan.toUpperCase()}-${Date.now()}`;

    // Get the base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/payments/pesapal/callback`;

    // Get the IPN notification ID from environment
    // This should be obtained by registering your IPN URL with Pesapal first
    const notificationId = process.env.PESAPAL_IPN_ID || '';

    // If userId is provided, verify user exists
    let validUserId = userId;
    if (userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      if (!user) {
        validUserId = null;
      }
    } else {
      // Try to find user by email
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (existingUser) {
        validUserId = existingUser.id;
      }
    }

    // Create payment
    const paymentResponse = await createPesapalPayment(
      amount,
      'USD',
      `ContentForge ${plan} Plan Subscription`,
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber || '',
      },
      merchantReference,
      callbackUrl,
      notificationId
    );

    // Store transaction in database with pending status
    await db.insert(transactions).values({
      userId: validUserId,
      paymentMethod: 'pesapal',
      status: 'pending',
      amount: amount * 100, // Convert to cents
      currency: 'USD',
      tier,
      pesapalOrderTrackingId: paymentResponse.order_tracking_id,
      pesapalMerchantReference: merchantReference,
      customerEmail: email,
      customerPhone: phoneNumber,
      customerName: `${firstName} ${lastName}`,
      metadata: {
        plan,
        firstName,
        lastName,
      },
    });

    return NextResponse.json({
      success: true,
      redirect_url: paymentResponse.redirect_url,
      order_tracking_id: paymentResponse.order_tracking_id,
      merchant_reference: merchantReference,
    });
  } catch (error: any) {
    console.error('Pesapal payment initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
