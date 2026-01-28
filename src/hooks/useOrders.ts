import { useState, useEffect, useCallback } from 'react';
import { Order } from '@tm-acme-shop/shared';
import { getOrders, getOrder, cancelOrder } from '../services/orderService';
import { getUserId } from '../utils/auth';

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
      console.log('Fetching orders'); // TODO(TEAM-FRONTEND): Replace with structured logger
      const ordersData = await getOrders(userId);
      setOrders(ordersData);
      console.log('Orders loaded'); // TODO(TEAM-FRONTEND): Replace with structured logger
    } catch (err) {
      console.log('Failed to load orders'); // TODO(TEAM-FRONTEND): Replace with structured logger
      setError(err instanceof Error ? err : new Error('Failed to load orders'));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCancel = useCallback(async (orderId: string) => {
    try {
      console.log('Cancelling order'); // TODO(TEAM-FRONTEND): Replace with structured logger
      const updatedOrder = await cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      console.log('Order cancelled'); // TODO(TEAM-FRONTEND): Replace with structured logger
    } catch (err) {
      console.log('Failed to cancel order'); // TODO(TEAM-FRONTEND): Replace with structured logger
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
      console.log('Fetching order'); // TODO(TEAM-FRONTEND): Replace with structured logger
      const orderData = await getOrder(orderId);
      setOrder(orderData);
    } catch (err) {
      console.log('Failed to load order'); // TODO(TEAM-FRONTEND): Replace with structured logger
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
