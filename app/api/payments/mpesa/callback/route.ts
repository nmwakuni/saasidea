import { NextRequest, NextResponse } from 'next/server';
import { mpesaClient, type MpesaCallbackResponse } from '@/lib/payments/mpesa';
import { db, transactions, subscriptions } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const body: MpesaCallbackResponse = await request.json();

    console.log('M-Pesa Callback Received:', JSON.stringify(body, null, 2));

    const checkoutRequestID = body.Body.stkCallback.CheckoutRequestID;

    // Find the transaction in database
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.mpesaCheckoutRequestId, checkoutRequestID),
    });

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

      if (transaction && transaction.status === 'pending') {
        // Update transaction status
        await db
          .update(transactions)
          .set({
            status: 'completed',
            mpesaReceiptNumber: result.data.MpesaReceiptNumber,
            paidAt: new Date(result.data.TransactionDate),
            updatedAt: new Date(),
          })
          .where(eq(transactions.id, transaction.id));

        // Update or create subscription
        if (transaction.userId) {
          const existingSubscription = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.userId, transaction.userId),
          });

          const subscriptionData = {
            tier: transaction.tier,
            status: 'active' as const,
            paymentMethod: 'mpesa' as const,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            updatedAt: new Date(),
          };

          if (existingSubscription) {
            await db
              .update(subscriptions)
              .set(subscriptionData)
              .where(eq(subscriptions.id, existingSubscription.id));
          } else {
            await db.insert(subscriptions).values({
              ...subscriptionData,
              userId: transaction.userId,
            });
          }
        }

        // Send success email
        if (transaction.customerEmail) {
          const planNames: Record<string, string> = {
            creator: 'Creator',
            pro: 'Pro',
            agency: 'Agency',
          };

          await sendPaymentSuccessEmail({
            to: transaction.customerEmail,
            customerName: transaction.customerName || 'Customer',
            planName: planNames[transaction.tier] || 'Creator',
            amount: transaction.amount,
            currency: transaction.currency,
            receiptNumber: result.data.MpesaReceiptNumber,
            paymentMethod: 'mpesa',
          });
        }
      }
    } else {
      // Payment failed
      console.log('M-Pesa Payment Failed:', {
        error: result.error,
        checkoutRequestID,
      });

      if (transaction && transaction.status === 'pending') {
        // Update transaction status
        await db
          .update(transactions)
          .set({
            status: 'failed',
            errorMessage: result.error || 'Payment failed',
            updatedAt: new Date(),
          })
          .where(eq(transactions.id, transaction.id));

        // Send failure email
        if (transaction.customerEmail) {
          const planNames: Record<string, string> = {
            creator: 'Creator',
            pro: 'Pro',
            agency: 'Agency',
          };

          await sendPaymentFailedEmail({
            to: transaction.customerEmail,
            customerName: transaction.customerName || 'Customer',
            planName: planNames[transaction.tier] || 'Creator',
            amount: transaction.amount,
            currency: transaction.currency,
            errorMessage: result.error,
          });
        }
      }
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
