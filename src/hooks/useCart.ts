import { useContext, useCallback } from 'react';
import { CartContext } from '../store/cartStore';
import { logger } from '../logging/logger';
import { CartItem, Product } from '../types';

export interface UseCartResult {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

/**
 * Hook to manage cart state.
 * Wraps cartStore with convenience selectors and actions.
 */
export function useCart(): UseCartResult {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { state, dispatch } = context;

  const addItem = useCallback(
    (product: Product, quantity: number = 1) => {
      console.log('Cart updated', state.items); // TODO(TEAM-FRONTEND): Replace with structured logger

      dispatch({
        type: 'ADD_ITEM',
        payload: { product, quantity },
      });

      logger.info('Item added to cart', {
        productId: product.id,
        quantity,
      });
    },
    [dispatch, state.items]
  );

  const removeItem = useCallback(
    (productId: string) => {
      dispatch({
        type: 'REMOVE_ITEM',
        payload: { productId },
      });

      logger.info('Item removed from cart', { productId });
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { productId, quantity },
      });

      logger.info('Cart item quantity updated', { productId, quantity });
    },
    [dispatch, removeItem]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    logger.info('Cart cleared');
  }, [dispatch]);

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items: state.items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
