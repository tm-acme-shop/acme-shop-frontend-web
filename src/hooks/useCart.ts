import { useContext, useCallback } from 'react';
import { CartContext } from '../store/cartStore';
import { CartItem, Product } from '../types';
import { createLogger } from '../logging';

const log = createLogger('use-cart');

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
      log.debug('Cart updated', { itemCount: state.items.length });

      dispatch({
        type: 'ADD_ITEM',
        payload: { product, quantity },
      });

      log.info('Item added to cart');
    },
    [dispatch, state.items]
  );

  const removeItem = useCallback(
    (productId: string) => {
      dispatch({
        type: 'REMOVE_ITEM',
        payload: { productId },
      });

      log.info('Item removed from cart', { productId });
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

      log.info('Cart item quantity updated', { productId, quantity });
    },
    [dispatch, removeItem]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    log.info('Cart cleared');
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
