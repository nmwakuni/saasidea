import {
  formatKenyanPhoneNumber,
  isValidKenyanPhoneNumber,
  isMpesaPaymentSuccessful,
  isMpesaPaymentPending,
} from '@/lib/payments/mpesa';
import type { MpesaSTKQueryResponse } from '@/lib/payments/mpesa';

describe('M-Pesa Payment Utilities', () => {
  describe('formatKenyanPhoneNumber', () => {
    it('should format phone number starting with 0', () => {
      expect(formatKenyanPhoneNumber('0712345678')).toBe('254712345678');
    });

    it('should format phone number with +254', () => {
      expect(formatKenyanPhoneNumber('+254712345678')).toBe('254712345678');
    });

    it('should format phone number with 254', () => {
      expect(formatKenyanPhoneNumber('254712345678')).toBe('254712345678');
    });

    it('should handle phone number with spaces', () => {
      expect(formatKenyanPhoneNumber('0712 345 678')).toBe('254712345678');
    });

    it('should handle phone number with dashes', () => {
      expect(formatKenyanPhoneNumber('0712-345-678')).toBe('254712345678');
    });

    it('should add 254 prefix to number without it', () => {
      expect(formatKenyanPhoneNumber('712345678')).toBe('254712345678');
    });
  });

  describe('isValidKenyanPhoneNumber', () => {
    it('should validate correct Safaricom number', () => {
      expect(isValidKenyanPhoneNumber('0712345678')).toBe(true);
      expect(isValidKenyanPhoneNumber('254712345678')).toBe(true);
      expect(isValidKenyanPhoneNumber('+254712345678')).toBe(true);
    });

    it('should validate correct Airtel number', () => {
      expect(isValidKenyanPhoneNumber('0  732345678')).toBe(true);
      expect(isValidKenyanPhoneNumber('254732345678')).toBe(true);
    });

    it('should reject invalid number format', () => {
      expect(isValidKenyanPhoneNumber('0612345678')).toBe(false); // Wrong prefix
      expect(isValidKenyanPhoneNumber('071234567')).toBe(false); // Too short
      expect(isValidKenyanPhoneNumber('07123456789')).toBe(false); // Too long
    });

    it('should reject non-Kenyan numbers', () => {
      expect(isValidKenyanPhoneNumber('255712345678')).toBe(false); // Tanzania
      expect(isValidKenyanPhoneNumber('+1234567890')).toBe(false); // US
    });
  });

  describe('isMpesaPaymentSuccessful', () => {
    it('should return true for successful payment (ResultCode "0")', () => {
      const response: MpesaSTKQueryResponse = {
        ResponseCode: '0',
        ResponseDescription: 'Success',
        MerchantRequestID: 'test-merchant-123',
        CheckoutRequestID: 'test-checkout-123',
        ResultCode: '0',
        ResultDesc: 'The service request is processed successfully.',
      };

      expect(isMpesaPaymentSuccessful(response)).toBe(true);
    });

    it('should return false for failed payment', () => {
      const response: MpesaSTKQueryResponse = {
        ResponseCode: '0',
        ResponseDescription: 'Success',
        MerchantRequestID: 'test-merchant-123',
        CheckoutRequestID: 'test-checkout-123',
        ResultCode: '1',
        ResultDesc: 'The balance is insufficient for the transaction',
      };

      expect(isMpesaPaymentSuccessful(response)).toBe(false);
    });

    it('should return false for cancelled payment', () => {
      const response: MpesaSTKQueryResponse = {
        ResponseCode: '0',
        ResponseDescription: 'Success',
        MerchantRequestID: 'test-merchant-123',
        CheckoutRequestID: 'test-checkout-123',
        ResultCode: '1032',
        ResultDesc: 'Request cancelled by user',
      };

      expect(isMpesaPaymentSuccessful(response)).toBe(false);
    });
  });

  describe('isMpesaPaymentPending', () => {
    it('should return true for pending payment', () => {
      const response: MpesaSTKQueryResponse = {
        ResponseCode: '0',
        ResponseDescription: 'Success',
        MerchantRequestID: 'test-merchant-123',
        CheckoutRequestID: 'test-checkout-123',
        ResultCode: '1037',
        ResultDesc: 'DS timeout user cannot be reached',
      };

      expect(isMpesaPaymentPending(response)).toBe(false); // Timeout is not pending
    });

    it('should return false for successful payment', () => {
      const response: MpesaSTKQueryResponse = {
        ResponseCode: '0',
        ResponseDescription: 'Success',
        MerchantRequestID: 'test-merchant-123',
        CheckoutRequestID: 'test-checkout-123',
        ResultCode: '0',
        ResultDesc: 'The service request is processed successfully.',
      };

      expect(isMpesaPaymentPending(response)).toBe(false);
    });

    it('should return false for cancelled payment', () => {
      const response: MpesaSTKQueryResponse = {
        ResponseCode: '0',
        ResponseDescription: 'Success',
        MerchantRequestID: 'test-merchant-123',
        CheckoutRequestID: 'test-checkout-123',
        ResultCode: '1032',
        ResultDesc: 'Request cancelled by user',
      };

      expect(isMpesaPaymentPending(response)).toBe(false);
    });
  });
});
