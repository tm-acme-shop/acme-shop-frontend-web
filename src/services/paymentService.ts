import {
  Payment,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  Money,
} from '@acme-shop/shared-ts';
import { getApiClient } from './apiClient';

export async function processPayment(
  orderId: string,
  userId: string,
  amount: Money,
  cardToken: string
): Promise<ProcessPaymentResponse> {
  console.log('Processing payment', orderId, amount.amount);

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

  console.log('Payment completed');

  return response;
}

export async function getPayment(paymentId: string): Promise<Payment> {
  console.log('Fetching payment', paymentId);

  const client = getApiClient();
  return client.getPayment(paymentId);
}

export async function refundPayment(
  paymentId: string,
  amount: Money,
  reason: string
): Promise<void> {
  console.log('Processing refund', paymentId, amount.amount);

  const client = getApiClient();
  await client.refundPayment({
    paymentId,
    amount,
    reason,
  });

  console.log('Refund completed', paymentId);
}

export function isValidPaymentAmount(amount: Money): boolean {
  return amount.amount > 0 && amount.amount <= 1000000;
}
