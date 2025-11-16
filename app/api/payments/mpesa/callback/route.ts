import { NextRequest, NextResponse } from 'next/server';
import { mpesaClient, type MpesaCallbackResponse } from '@/lib/payments/mpesa';

export async function POST(request: NextRequest) {
  try {
    const body: MpesaCallbackResponse = await request.json();

    console.log('M-Pesa Callback Received:', JSON.stringify(body, null, 2));

    // Parse callback data
    const result = mpesaClient.parseCallback(body);

    if (result.success && result.data) {
      // Payment successful
      console.log('M-Pesa Payment Successful:', {
        amount: result.data.Amount,
        receipt: result.data.MpesaReceiptNumber,
        phone: result.data.PhoneNumber,
        date: new Date(result.data.TransactionDate),
      });

      // TODO: Update subscription in database
      // TODO: Send confirmation email
      // TODO: Activate user subscription
      // TODO: Store receipt number for reference

      // Example database update:
      // await db.update(subscriptions).set({
      //   status: 'active',
      //   mpesa_receipt: result.data.MpesaReceiptNumber,
      //   paid_amount: result.data.Amount,
      //   paid_at: new Date(result.data.TransactionDate),
      // }).where(eq(subscriptions.checkout_request_id, body.Body.stkCallback.CheckoutRequestID));
    } else {
      // Payment failed
      console.log('M-Pesa Payment Failed:', {
        error: result.error,
        checkoutRequestID: body.Body.stkCallback.CheckoutRequestID,
      });

      // TODO: Update transaction status in database
      // TODO: Notify user of failed payment
    }

    // Always return success to M-Pesa
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Accepted',
    });
  } catch (error: any) {
    console.error('M-Pesa callback processing error:', error);

    // Still return success to M-Pesa to prevent retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Accepted',
    });
  }
}
