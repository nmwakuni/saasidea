import { NextRequest, NextResponse } from 'next/server';
import { createPesapalPayment } from '@/lib/payments/pesapal';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, firstName, lastName, phoneNumber, plan } = body;

    // Validate required fields
    if (!amount || !email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique merchant reference
    const merchantReference = `SUB-${plan.toUpperCase()}-${Date.now()}`;

    // Get the base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/payments/pesapal/callback`;

    // Get the IPN notification ID from environment
    // This should be obtained by registering your IPN URL with Pesapal first
    const notificationId = process.env.PESAPAL_IPN_ID || '';

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

    // TODO: Store transaction in database with pending status

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
