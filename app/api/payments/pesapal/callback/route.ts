import { NextRequest, NextResponse } from 'next/server';
import {
  checkPesapalPaymentStatus,
  isPesapalPaymentCompleted,
  isPesapalPaymentFailed,
} from '@/lib/payments/pesapal';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const merchantReference = searchParams.get('OrderMerchantReference');

    if (!orderTrackingId) {
      return NextResponse.redirect(new URL('/dashboard/billing?status=error', request.url));
    }

    // Check payment status
    const status = await checkPesapalPaymentStatus(orderTrackingId);

    if (isPesapalPaymentCompleted(status)) {
      // TODO: Update subscription in database
      // TODO: Send confirmation email
      // TODO: Activate user subscription

      console.log('Payment successful:', {
        orderTrackingId,
        merchantReference,
        confirmationCode: status.confirmation_code,
        amount: status.amount,
      });

      return NextResponse.redirect(new URL('/dashboard/billing?status=success', request.url));
    } else if (isPesapalPaymentFailed(status)) {
      console.log('Payment failed:', {
        orderTrackingId,
        merchantReference,
        status: status.payment_status_description,
      });

      return NextResponse.redirect(new URL('/dashboard/billing?status=failed', request.url));
    } else {
      // Payment pending
      return NextResponse.redirect(new URL('/dashboard/billing?status=pending', request.url));
    }
  } catch (error: any) {
    console.error('Pesapal callback error:', error);
    return NextResponse.redirect(new URL('/dashboard/billing?status=error', request.url));
  }
}

// Handle IPN notifications (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { OrderTrackingId, OrderMerchantReference } = body;

    if (!OrderTrackingId) {
      return NextResponse.json({ error: 'Missing OrderTrackingId' }, { status: 400 });
    }

    // Check payment status
    const status = await checkPesapalPaymentStatus(OrderTrackingId);

    if (isPesapalPaymentCompleted(status)) {
      // TODO: Update subscription in database
      // TODO: Send confirmation email
      // TODO: Activate user subscription

      console.log('IPN - Payment successful:', {
        orderTrackingId: OrderTrackingId,
        merchantReference: OrderMerchantReference,
        confirmationCode: status.confirmation_code,
      });
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Pesapal IPN error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
