import {
  isPesapalPaymentCompleted,
  isPesapalPaymentFailed,
  isPesapalPaymentPending,
} from '@/lib/payments/pesapal';
import type { PesapalTransactionStatus } from '@/lib/payments/pesapal';

describe('Pesapal Payment Utilities', () => {
  const createMockStatus = (statusCode: number): PesapalTransactionStatus => ({
    payment_method: 'Card',
    amount: 100,
    created_date: '2024-02-15T10:00:00Z',
    confirmation_code: 'ABC123',
    payment_status_description: 'Completed',
    description: 'Test payment',
    message: 'Success',
    payment_account: '****1234',
    call_back_url: 'https://example.com/callback',
    status_code: statusCode,
    merchant_reference: 'TEST-123',
    payment_status_code: statusCode.toString(),
    currency: 'USD',
  });

  describe('isPesapalPaymentCompleted', () => {
    it('should return true for completed payment (status code 1)', () => {
      const status = createMockStatus(1);
      expect(isPesapalPaymentCompleted(status)).toBe(true);
    });

    it('should return false for pending payment (status code 0)', () => {
      const status = createMockStatus(0);
      expect(isPesapalPaymentCompleted(status)).toBe(false);
    });

    it('should return false for failed payment (status code 2)', () => {
      const status = createMockStatus(2);
      expect(isPesapalPaymentCompleted(status)).toBe(false);
    });
  });

  describe('isPesapalPaymentFailed', () => {
    it('should return true for failed payment (status code 2)', () => {
      const status = createMockStatus(2);
      expect(isPesapalPaymentFailed(status)).toBe(true);
    });

    it('should return false for completed payment (status code 1)', () => {
      const status = createMockStatus(1);
      expect(isPesapalPaymentFailed(status)).toBe(false);
    });

    it('should return false for pending payment (status code 0)', () => {
      const status = createMockStatus(0);
      expect(isPesapalPaymentFailed(status)).toBe(false);
    });
  });

  describe('isPesapalPaymentPending', () => {
    it('should return true for pending payment (status code 0)', () => {
      const status = createMockStatus(0);
      expect(isPesapalPaymentPending(status)).toBe(true);
    });

    it('should return false for completed payment (status code 1)', () => {
      const status = createMockStatus(1);
      expect(isPesapalPaymentPending(status)).toBe(false);
    });

    it('should return false for failed payment (status code 2)', () => {
      const status = createMockStatus(2);
      expect(isPesapalPaymentPending(status)).toBe(false);
    });
  });
});
