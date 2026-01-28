import { Order } from '@tm-acme-shop/shared';
import { getApiClient } from './apiClient';
import { legacyRequest, modernRequest } from './httpClient';
import { API_BASE_URL_V1, API_BASE_URL_V2 } from '../config/apiConfig';

/**
 * Get orders for the current user.
 */
export async function getOrders(userId: string): Promise<Order[]> {
  console.log('Fetching orders', userId); // TODO(TEAM-FRONTEND): Replace with structured logger

  const client = getApiClient();
  const response = await client.listOrders({
    userId,
    limit: 50,
    offset: 0,
  });
  return response.orders;
}

/**
 * Get a single order by ID.
 */
export async function getOrder(orderId: string): Promise<Order> {
  console.log('Fetching order', orderId); // TODO(TEAM-FRONTEND): Replace with structured logger

  const client = getApiClient();
  return client.getOrder(orderId);
}

/**
 * Export orders to CSV - still uses legacy endpoint.
 * @deprecated This endpoint uses v1 API with legacy headers.
 *
 * TODO(TEAM-API): Migrate order export endpoint to v2 API and new headers
 */
export async function exportOrdersCsv(userId: string): Promise<Blob> {
  console.log('Exporting orders to CSV'); // TODO(TEAM-FRONTEND): Replace with structured logger

  const response = await legacyRequest<Blob>(
    'GET',
    `${API_BASE_URL_V1}/users/${userId}/orders/export`,
    undefined,
    {
      headers: {
        Accept: 'text/csv',
      },
    }
  );
  return response.data;
}

/**
 * Export orders to PDF - uses modern endpoint.
 */
export async function exportOrdersPdf(userId: string): Promise<Blob> {
  console.log('Exporting orders to PDF', userId); // TODO(TEAM-FRONTEND): Replace with structured logger

  const response = await modernRequest<Blob>(
    'GET',
    `${API_BASE_URL_V2}/users/${userId}/orders/export`,
    undefined,
    {
      headers: {
        Accept: 'application/pdf',
      },
    }
  );
  return response.data;
}

/**
 * Cancel an order.
 */
export async function cancelOrder(orderId: string): Promise<Order> {
  console.log('Cancelling order', orderId); // TODO(TEAM-FRONTEND): Replace with structured logger

  const client = getApiClient();
  return client.updateOrderStatus(orderId, {
    status: 'cancelled',
    notes: 'Cancelled by customer',
  });
}
