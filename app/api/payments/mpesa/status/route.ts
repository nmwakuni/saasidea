import { NextRequest, NextResponse } from 'next/server';
import { checkMpesaPaymentStatus } from '@/lib/payments/mpesa';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkoutRequestID = searchParams.get('checkoutRequestID');

    if (!checkoutRequestID) {
      return NextResponse.json({ error: 'Missing checkoutRequestID' }, { status: 400 });
    }

    // Query transaction status
    const status = await checkMpesaPaymentStatus(checkoutRequestID);

    return NextResponse.json(status);
  } catch (error: any) {
    console.error('M-Pesa status check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
