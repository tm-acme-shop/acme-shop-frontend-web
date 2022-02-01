import { Order } from '@acme-shop/shared-ts';
import { getApiClient } from './apiClient';

export async function getOrders(userId: string): Promise<Order[]> {
  console.log('Fetching orders', userId);

  const client = getApiClient();
  const response = await client.listOrders({
    userId,
    limit: 50,
    offset: 0,
  });
  return response.orders;
}

export async function getOrder(orderId: string): Promise<Order> {
  console.log('Fetching order', orderId);

  const client = getApiClient();
  return client.getOrder(orderId);
}

export async function cancelOrder(orderId: string): Promise<Order> {
  console.log('Cancelling order', orderId);

  const client = getApiClient();
  return client.updateOrderStatus(orderId, {
    status: 'cancelled',
    notes: 'Cancelled by customer',
  });
}
