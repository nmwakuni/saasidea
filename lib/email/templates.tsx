import React from 'react';

interface PaymentSuccessEmailProps {
  customerName: string;
  planName: string;
  amount: number;
  currency: string;
  receiptNumber?: string;
  paymentMethod: 'pesapal' | 'mpesa' | 'stripe';
}

export function PaymentSuccessEmail({
  customerName,
  planName,
  amount,
  currency,
  receiptNumber,
  paymentMethod,
}: PaymentSuccessEmailProps) {
  const formattedAmount =
    currency === 'KSH'
      ? `KSH ${amount.toLocaleString()}`
      : `$${(amount / 100).toFixed(2)}`;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div
        style={{
          background: 'linear-gradient(to right, #2563eb, #9333ea)',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'white', margin: 0 }}>Payment Successful! 🎉</h1>
      </div>

      <div style={{ padding: '40px 20px', backgroundColor: '#f9fafb' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#374151' }}>
          Hi {customerName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#374151' }}>
          Thank you for upgrading to the <strong>{planName}</strong> plan! Your payment has been
          successfully processed.
        </p>

        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
          }}
        >
          <h2 style={{ fontSize: '18px', marginTop: 0, color: '#111827' }}>
            Payment Details
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6',
                    color: '#6b7280',
                  }}
                >
                  Plan
                </td>
                <td
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: '#111827',
                  }}
                >
                  {planName}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6',
                    color: '#6b7280',
                  }}
                >
                  Amount
                </td>
                <td
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: '#111827',
                  }}
                >
                  {formattedAmount}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 0', color: '#6b7280' }}>Payment Method</td>
                <td
                  style={{
                    padding: '12px 0',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: '#111827',
                  }}
                >
                  {paymentMethod === 'mpesa'
                    ? 'M-Pesa'
                    : paymentMethod === 'pesapal'
                      ? 'Pesapal'
                      : 'Stripe'}
                </td>
              </tr>
              {receiptNumber && (
                <tr>
                  <td style={{ padding: '12px 0', color: '#6b7280' }}>
                    Receipt Number
                  </td>
                  <td
                    style={{
                      padding: '12px 0',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#111827',
                    }}
                  >
                    {receiptNumber}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
            <strong>What's Next?</strong>
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#1e40af' }}>
            Your account has been upgraded and you now have access to all {planName} features.
            Start creating amazing content today!
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Go to Dashboard
          </a>
        </div>

        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#6b7280', marginTop: '30px' }}>
          If you have any questions, please don't hesitate to contact our support team.
        </p>

        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#6b7280' }}>
          Best regards,
          <br />
          The ContentForge Team
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#111827',
          padding: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#9ca3af',
        }}
      >
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} ContentForge. All rights reserved.
        </p>
      </div>
    </div>
  );
}

interface PaymentFailedEmailProps {
  customerName: string;
  planName: string;
  amount: number;
  currency: string;
  errorMessage?: string;
}

export function PaymentFailedEmail({
  customerName,
  planName,
  amount,
  currency,
  errorMessage,
}: PaymentFailedEmailProps) {
  const formattedAmount =
    currency === 'KSH'
      ? `KSH ${amount.toLocaleString()}`
      : `$${(amount / 100).toFixed(2)}`;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div
        style={{
          background: '#dc2626',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'white', margin: 0 }}>Payment Failed</h1>
      </div>

      <div style={{ padding: '40px 20px', backgroundColor: '#f9fafb' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#374151' }}>
          Hi {customerName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#374151' }}>
          We were unable to process your payment for the <strong>{planName}</strong> plan.
        </p>

        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
          }}
        >
          <h2 style={{ fontSize: '18px', marginTop: 0, color: '#111827' }}>
            Payment Details
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6',
                    color: '#6b7280',
                  }}
                >
                  Plan
                </td>
                <td
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: '#111827',
                  }}
                >
                  {planName}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 0', color: '#6b7280' }}>
                  Amount
                </td>
                <td
                  style={{
                    padding: '12px 0',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: '#111827',
                  }}
                >
                  {formattedAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>
              <strong>Error:</strong> {errorMessage}
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing`}
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Try Again
          </a>
        </div>

        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#6b7280', marginTop: '30px' }}>
          If you continue to experience issues, please contact our support team for assistance.
        </p>

        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#6b7280' }}>
          Best regards,
          <br />
          The ContentForge Team
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#111827',
          padding: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#9ca3af',
        }}
      >
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} ContentForge. All rights reserved.
        </p>
      </div>
    </div>
  );
}
