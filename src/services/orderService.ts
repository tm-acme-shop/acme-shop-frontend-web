import { Order } from '@acme-shop/shared-ts';
import { getApiClient } from './apiClient';
import { createLogger } from '../logging/logger';

const logger = createLogger('orderService');

export async function getOrders(userId: string): Promise<Order[]> {
  logger.info('Fetching orders', { userId });

  const client = getApiClient();
  const response = await client.listOrders({
    userId,
    limit: 50,
    offset: 0,
  });
  return response.orders;
}

export async function getOrder(orderId: string): Promise<Order> {
  logger.info('Fetching order', { orderId });

  const client = getApiClient();
  return client.getOrder(orderId);
}

export async function cancelOrder(orderId: string): Promise<Order> {
  logger.info('Cancelling order', { orderId });

  const client = getApiClient();
  return client.updateOrderStatus(orderId, {
    status: 'cancelled',
    notes: 'Cancelled by customer',
  });
}

/**
 * @deprecated Use exportOrdersPdf() instead
 * TODO(TEAM-API): Remove exportOrdersCsv once PDF export is fully adopted
 */
export async function exportOrdersCsv(userId: string): Promise<Blob> {
  console.log('Exporting orders as CSV (legacy)', userId);

  const client = getApiClient();
  return client.exportOrdersCsvV1(userId);
}

export async function exportOrdersPdf(userId: string): Promise<Blob> {
  logger.info('Exporting orders as PDF', { userId });

  const client = getApiClient();
  return client.exportOrdersPdf(userId);
}
