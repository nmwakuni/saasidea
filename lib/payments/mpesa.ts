import axios from 'axios';

// M-Pesa API configuration
const MPESA_BASE_URL =
  process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY!;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE!;

export interface MpesaSTKPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  Amount: number;
  PartyA: string; // Phone number sending money
  PartyB: string; // Organization receiving money
  PhoneNumber: string; // Phone number to receive STK push
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface MpesaSTKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface MpesaSTKQueryRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  CheckoutRequestID: string;
}

export interface MpesaSTKQueryResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

export interface MpesaCallbackMetadata {
  Amount: number;
  MpesaReceiptNumber: string;
  TransactionDate: number;
  PhoneNumber: string;
}

export interface MpesaCallbackResponse {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: any;
        }>;
      };
    };
  };
}

class MpesaClient {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Generate password for STK push
   */
  private generatePassword(timestamp: string): string {
    const data = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`;
    return Buffer.from(data).toString('base64');
  }

  /**
   * Generate timestamp in format YYYYMMDDHHmmss
   */
  private generateTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  /**
   * Get OAuth access token
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');

      const response = await axios.get(
        `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry to 5 minutes before actual expiry
      this.tokenExpiry = Date.now() + (parseInt(response.data.expires_in) - 300) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('M-Pesa authentication error:', error);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  /**
   * Initiate STK Push (Lipa Na M-Pesa Online)
   */
  async stkPush(
    phoneNumber: string,
    amount: number,
    accountReference: string,
    transactionDesc: string,
    callbackUrl: string
  ): Promise<MpesaSTKPushResponse> {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      // Format phone number (remove leading 0 or +254)
      let formattedPhone = phoneNumber.replace(/^0/, '254').replace(/^\+/, '');
      if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      const requestBody: MpesaSTKPushRequest = {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      };

      const response = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('M-Pesa STK Push error:', error.response?.data || error);
      throw new Error(error.response?.data?.errorMessage || 'Failed to initiate M-Pesa payment');
    }
  }

  /**
   * Query STK Push transaction status
   */
  async stkQuery(checkoutRequestID: string): Promise<MpesaSTKQueryResponse> {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const requestBody: MpesaSTKQueryRequest = {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      };

      const response = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('M-Pesa STK Query error:', error);
      throw new Error('Failed to query M-Pesa transaction status');
    }
  }

  /**
   * Parse M-Pesa callback response
   */
  parseCallback(callbackData: MpesaCallbackResponse): {
    success: boolean;
    data?: MpesaCallbackMetadata;
    error?: string;
  } {
    const { stkCallback } = callbackData.Body;

    // ResultCode 0 means success
    if (stkCallback.ResultCode === 0 && stkCallback.CallbackMetadata) {
      const metadata: any = {};

      stkCallback.CallbackMetadata.Item.forEach((item) => {
        metadata[item.Name] = item.Value;
      });

      return {
        success: true,
        data: {
          Amount: metadata.Amount,
          MpesaReceiptNumber: metadata.MpesaReceiptNumber,
          TransactionDate: metadata.TransactionDate,
          PhoneNumber: metadata.PhoneNumber,
        },
      };
    }

    return {
      success: false,
      error: stkCallback.ResultDesc,
    };
  }
}

// Export singleton instance
export const mpesaClient = new MpesaClient();

// Helper functions
export async function initiateMpesaPayment(
  phoneNumber: string,
  amount: number,
  accountReference: string,
  description: string,
  callbackUrl: string
): Promise<MpesaSTKPushResponse> {
  return mpesaClient.stkPush(phoneNumber, amount, accountReference, description, callbackUrl);
}

export async function checkMpesaPaymentStatus(
  checkoutRequestID: string
): Promise<MpesaSTKQueryResponse> {
  return mpesaClient.stkQuery(checkoutRequestID);
}

export function isMpesaPaymentSuccessful(response: MpesaSTKQueryResponse): boolean {
  // ResultCode "0" means success
  return response.ResultCode === '0';
}

export function isMpesaPaymentPending(response: MpesaSTKQueryResponse): boolean {
  // ResultCode "1032" means request cancelled by user
  // ResultCode "1037" means timeout (user didn't enter PIN)
  return !['0', '1032', '1037'].includes(response.ResultCode);
}

export function formatKenyanPhoneNumber(phone: string): string {
  // Remove any spaces, dashes, or plus signs
  let cleaned = phone.replace(/[\s\-+]/g, '');

  // Remove leading 0 if present
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }

  // Add 254 if not present
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }

  return cleaned;
}

export function isValidKenyanPhoneNumber(phone: string): boolean {
  const formatted = formatKenyanPhoneNumber(phone);
  // Kenyan phone numbers should be 12 digits (254 + 9 digits)
  return /^254[17]\d{8}$/.test(formatted);
}
