import { useState, useEffect, useCallback } from 'react';
import { Order } from '@tm-acme-shop/shared';
import { getOrders, getOrder, cancelOrder } from '../services/orderService';
import { getUserId } from '../utils/auth';
import { logger } from '../logging/logger';

export interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  cancel: (orderId: string) => Promise<void>;
}

export interface UseOrderResult {
  order: Order | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and cache user orders.
 * Uses orderService which still has one legacy endpoint for export.
 */
export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      logger.debug('Fetching orders');
      const ordersData = await getOrders(userId);
      setOrders(ordersData);
      logger.debug('Orders loaded');
    } catch (err) {
      logger.error('Failed to load orders');
      setError(err instanceof Error ? err : new Error('Failed to load orders'));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCancel = useCallback(async (orderId: string) => {
    try {
      logger.info('Cancelling order');
      const updatedOrder = await cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      logger.info('Order cancelled');
    } catch (err) {
      logger.error('Failed to cancel order');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    cancel: handleCancel,
  };
}

/**
 * Hook to fetch a single order by ID.
 */
export function useOrder(orderId: string): UseOrderResult {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      logger.debug('Fetching order');
      const orderData = await getOrder(orderId);
      setOrder(orderData);
    } catch (err) {
      logger.error('Failed to load order');
      setError(err instanceof Error ? err : new Error('Failed to load order'));
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
}
