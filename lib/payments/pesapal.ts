import axios from 'axios';

// Pesapal API configuration
const PESAPAL_BASE_URL =
  process.env.PESAPAL_ENVIRONMENT === 'production'
    ? 'https://pay.pesapal.com/v3'
    : 'https://cybqa.pesapal.com/pesapalv3';

const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY!;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET!;

export interface PesapalCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface PesapalTransaction {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address?: {
    email_address: string;
    phone_number: string;
    country_code: string;
    first_name: string;
    last_name: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    zip_code?: string;
  };
}

export interface PesapalPaymentResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error?: {
    error_type: string;
    code: string;
    message: string;
    call_back_url: string;
  };
  status: string;
}

export interface PesapalTransactionStatus {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code: string;
  currency: string;
}

class PesapalClient {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Get authentication token from Pesapal
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${PESAPAL_BASE_URL}/api/Auth/RequestToken`,
        {
          consumer_key: PESAPAL_CONSUMER_KEY,
          consumer_secret: PESAPAL_CONSUMER_SECRET,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      this.accessToken = response.data.token;
      // Set expiry to 5 minutes before actual expiry (tokens usually last 1 hour)
      this.tokenExpiry = Date.now() + (response.data.expiryDate - 300) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('Pesapal authentication error:', error);
      throw new Error('Failed to authenticate with Pesapal');
    }
  }

  /**
   * Register IPN (Instant Payment Notification) URL
   */
  async registerIPN(url: string, ipnType: 'GET' | 'POST' = 'POST'): Promise<string> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`,
        {
          url,
          ipn_notification_type: ipnType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      return response.data.ipn_id;
    } catch (error) {
      console.error('Failed to register IPN:', error);
      throw new Error('Failed to register IPN with Pesapal');
    }
  }

  /**
   * Submit order request to Pesapal
   */
  async submitOrderRequest(transaction: PesapalTransaction): Promise<PesapalPaymentResponse> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
        transaction,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to submit order request:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit order request to Pesapal');
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(orderTrackingId: string): Promise<PesapalTransactionStatus> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      throw new Error('Failed to get transaction status from Pesapal');
    }
  }

  /**
   * Refund a transaction
   */
  async refundTransaction(
    confirmationCode: string,
    amount: number,
    username: string,
    remarks?: string
  ): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${PESAPAL_BASE_URL}/api/Transactions/RefundRequest`,
        {
          confirmation_code: confirmationCode,
          amount,
          username,
          remarks: remarks || 'Refund request',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to process refund:', error);
      throw new Error('Failed to process refund with Pesapal');
    }
  }
}

// Export singleton instance
export const pesapalClient = new PesapalClient();

// Helper functions
export async function createPesapalPayment(
  amount: number,
  currency: string,
  description: string,
  customer: PesapalCustomer,
  merchantReference: string,
  callbackUrl: string,
  notificationId: string
): Promise<PesapalPaymentResponse> {
  const transaction: PesapalTransaction = {
    id: merchantReference,
    currency,
    amount,
    description,
    callback_url: callbackUrl,
    notification_id: notificationId,
    billing_address: {
      email_address: customer.email,
      phone_number: customer.phone_number,
      country_code: 'KE', // Default to Kenya
      first_name: customer.first_name,
      last_name: customer.last_name,
    },
  };

  return pesapalClient.submitOrderRequest(transaction);
}

export async function checkPesapalPaymentStatus(
  orderTrackingId: string
): Promise<PesapalTransactionStatus> {
  return pesapalClient.getTransactionStatus(orderTrackingId);
}

export function isPesapalPaymentCompleted(status: PesapalTransactionStatus): boolean {
  // Status code 1 = Completed
  return status.status_code === 1;
}

export function isPesapalPaymentFailed(status: PesapalTransactionStatus): boolean {
  // Status code 2 = Failed
  return status.status_code === 2;
}

export function isPesapalPaymentPending(status: PesapalTransactionStatus): boolean {
  // Status code 0 = Pending
  return status.status_code === 0;
}
