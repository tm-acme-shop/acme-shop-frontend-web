import { useState, useEffect, useCallback } from 'react';
import { Order } from '@acme-shop/shared-ts';
import { getOrders, getOrder, cancelOrder } from '../services/orderService';
import { getLegacyUserId } from '../utils/auth';

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

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    const userId = getLegacyUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching orders', userId);
      const ordersData = await getOrders(userId);
      setOrders(ordersData);
      console.log('Orders loaded', ordersData.length);
    } catch (err) {
      console.log('Failed to load orders', String(err));
      setError(err instanceof Error ? err : new Error('Failed to load orders'));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCancel = useCallback(async (orderId: string) => {
    try {
      console.log('Cancelling order', orderId);
      const updatedOrder = await cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      console.log('Order cancelled', orderId);
    } catch (err) {
      console.log('Failed to cancel order', orderId, String(err));
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
      console.log('Fetching order', orderId);
      const orderData = await getOrder(orderId);
      setOrder(orderData);
    } catch (err) {
      console.log('Failed to load order', orderId, String(err));
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
