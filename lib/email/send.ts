import { resend, EMAIL_FROM } from './client';
import { PaymentSuccessEmail, PaymentFailedEmail } from './templates';
import { render } from '@react-email/components';

interface SendPaymentSuccessEmailParams {
  to: string;
  customerName: string;
  planName: string;
  amount: number;
  currency: string;
  receiptNumber?: string;
  paymentMethod: 'pesapal' | 'mpesa' | 'stripe';
}

export async function sendPaymentSuccessEmail(params: SendPaymentSuccessEmailParams) {
  try {
    const emailHtml = await render(
      PaymentSuccessEmail({
        customerName: params.customerName,
        planName: params.planName,
        amount: params.amount,
        currency: params.currency,
        receiptNumber: params.receiptNumber,
        paymentMethod: params.paymentMethod,
      })
    );

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `Payment Successful - ${params.planName} Plan`,
      html: emailHtml,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending payment success email:', error);
    return { success: false, error };
  }
}

interface SendPaymentFailedEmailParams {
  to: string;
  customerName: string;
  planName: string;
  amount: number;
  currency: string;
  errorMessage?: string;
}

export async function sendPaymentFailedEmail(params: SendPaymentFailedEmailParams) {
  try {
    const emailHtml = await render(
      PaymentFailedEmail({
        customerName: params.customerName,
        planName: params.planName,
        amount: params.amount,
        currency: params.currency,
        errorMessage: params.errorMessage,
      })
    );

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `Payment Failed - ${params.planName} Plan`,
      html: emailHtml,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending payment failed email:', error);
    return { success: false, error };
  }
}
