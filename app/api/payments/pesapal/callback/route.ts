import { NextRequest, NextResponse } from 'next/server';
import {
  checkPesapalPaymentStatus,
  isPesapalPaymentCompleted,
  isPesapalPaymentFailed,
} from '@/lib/payments/pesapal';
import { db, transactions, subscriptions } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from '@/lib/email/send';

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

    // Find the transaction in database
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.pesapalOrderTrackingId, orderTrackingId),
    });

    if (isPesapalPaymentCompleted(status)) {
      if (transaction) {
        // Update transaction status
        await db
          .update(transactions)
          .set({
            status: 'completed',
            pesapalConfirmationCode: status.confirmation_code,
            paidAt: new Date(),
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
            paymentMethod: 'pesapal' as const,
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
            receiptNumber: status.confirmation_code,
            paymentMethod: 'pesapal',
          });
        }
      }

      console.log('Payment successful:', {
        orderTrackingId,
        merchantReference,
        confirmationCode: status.confirmation_code,
        amount: status.amount,
      });

      return NextResponse.redirect(new URL('/dashboard/billing?status=success', request.url));
    } else if (isPesapalPaymentFailed(status)) {
      if (transaction) {
        // Update transaction status
        await db
          .update(transactions)
          .set({
            status: 'failed',
            errorMessage: status.payment_status_description,
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
            errorMessage: status.payment_status_description,
          });
        }
      }

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

    // Find the transaction in database
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.pesapalOrderTrackingId, OrderTrackingId),
    });

    if (isPesapalPaymentCompleted(status)) {
      if (transaction && transaction.status === 'pending') {
        // Update transaction status
        await db
          .update(transactions)
          .set({
            status: 'completed',
            pesapalConfirmationCode: status.confirmation_code,
            paidAt: new Date(),
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
            paymentMethod: 'pesapal' as const,
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
            receiptNumber: status.confirmation_code,
            paymentMethod: 'pesapal',
          });
        }

        console.log('IPN - Payment successful:', {
          orderTrackingId: OrderTrackingId,
          merchantReference: OrderMerchantReference,
          confirmationCode: status.confirmation_code,
        });
      }
    } else if (isPesapalPaymentFailed(status) && transaction && transaction.status === 'pending') {
      // Update transaction as failed
      await db
        .update(transactions)
        .set({
          status: 'failed',
          errorMessage: status.payment_status_description,
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
          errorMessage: status.payment_status_description,
        });
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Pesapal IPN error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
