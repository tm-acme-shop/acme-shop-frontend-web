import {
  Payment,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  Money,
} from '@tm-acme-shop/shared';
import { getApiClient } from './apiClient';

/**
 * Process a payment for an order.
 */
export async function processPayment(
  orderId: string,
  userId: string,
  amount: Money,
  cardToken: string
): Promise<ProcessPaymentResponse> {
  console.log('Processing payment', orderId); // TODO(TEAM-FRONTEND): Replace with structured logger

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

  console.log('Payment completed'); // TODO(TEAM-FRONTEND): Replace with structured logger

  return response;
}

/**
 * Get payment status.
 */
export async function getPayment(paymentId: string): Promise<Payment> {
  console.log('Fetching payment', paymentId); // TODO(TEAM-FRONTEND): Replace with structured logger

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
  console.log('Processing refund', paymentId); // TODO(TEAM-FRONTEND): Replace with structured logger

  const client = getApiClient();
  await client.refundPayment({
    paymentId,
    amount,
    reason,
  });

  console.log('Refund completed', paymentId); // TODO(TEAM-FRONTEND): Replace with structured logger
}

/**
 * Validate payment amount.
 */
export function isValidPaymentAmount(amount: Money): boolean {
  return amount.amount > 0 && amount.amount <= 1000000;
}
