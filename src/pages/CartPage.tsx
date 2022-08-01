import { useEffect } from 'react';
import { CartSummary } from '../components/cart/CartSummary';
import { createLogger } from '../logging/logger';

const logger = createLogger('CartPage');

export function CartPage() {
  useEffect(() => {
    console.log('Page view: cart');
    logger.info('Page view', { page: 'cart' });
  }, []);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <CartSummary />
    </div>
  );
}
