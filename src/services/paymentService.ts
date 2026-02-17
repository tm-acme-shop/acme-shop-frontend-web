import {
  Payment,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  Money,
} from '@tm-acme-shop/shared';
import { getApiClient } from './apiClient';
import { createLogger } from '../logging';

const log = createLogger('payment-service');

/**
 * Process a payment for an order.
 */
export async function processPayment(
  orderId: string,
  userId: string,
  amount: Money,
  cardToken: string
): Promise<ProcessPaymentResponse> {
  log.info('Processing payment', { orderId });

  const client = getApiClient();
  const request: ProcessPaymentRequest = {
    orderId,
    userId,
    amount,
    method: 'credit_card',
    cardToken,
    returnUrl: `${window.location.origin}/orders/${orderId}/confirmation`,
  };

  const response = await client.processPayment(request);

  log.info('Payment completed');

  return response;
}

/**
 * Get payment status.
 */
export async function getPayment(paymentId: string): Promise<Payment> {
  log.info('Fetching payment', { paymentId });

  const client = getApiClient();
  return client.getPayment(paymentId);
}

/**
 * Request a refund for a payment.
 */
export async function refundPayment(
  paymentId: string,
  amount: Money,
  reason: string
): Promise<void> {
  log.info('Processing refund', { paymentId });

  const client = getApiClient();
  await client.refundPayment({
    paymentId,
    amount,
    reason,
  });

  log.info('Refund completed', { paymentId });
}

/**
 * Validate payment amount.
 */
export function isValidPaymentAmount(amount: Money): boolean {
  return amount.amount > 0 && amount.amount <= 1000000;
}
