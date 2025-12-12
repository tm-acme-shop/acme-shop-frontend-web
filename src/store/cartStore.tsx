import { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { logger } from '../logging/logger';
import { CartItem, Product } from '../types';

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

export interface CartContextValue {
  state: CartState;
  dispatch: Dispatch<CartAction>;
}

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.productId === product.id
      );

      logger.info('Cart add item', { productId: product.id, quantity });

      if (existingIndex >= 0) {
        const items = [...state.items];
        items[existingIndex] = {
          ...items[existingIndex],
          quantity: items[existingIndex].quantity + quantity,
        };
        return { ...state, items };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
          },
        ],
      };
    }

    case 'REMOVE_ITEM': {
      logger.info('Cart remove item', { productId: action.payload.productId });
      return {
        ...state,
        items: state.items.filter(
          (item) => item.productId !== action.payload.productId
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      logger.info('Cart update quantity', { productId, quantity });

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        ),
      };
    }

    case 'CLEAR_CART': {
      logger.info('Cart cleared');
      return initialState;
    }

    default:
      return state;
  }
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
