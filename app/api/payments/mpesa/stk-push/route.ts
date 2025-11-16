import { NextRequest, NextResponse } from 'next/server';
import { initiateMpesaPayment } from '@/lib/payments/mpesa';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, amount, accountReference, description } = body;

    // Validate required fields
    if (!phoneNumber || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    // TODO: Store transaction in database with pending status

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
