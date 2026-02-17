import { useEffect } from 'react';
import { CartSummary } from '../components/cart/CartSummary';
import { logger } from '../logging/logger';

export function CartPage() {
  useEffect(() => {
    logger.debug('Page view', { page: 'cart' });
  }, []);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <CartSummary />
    </div>
  );
}
