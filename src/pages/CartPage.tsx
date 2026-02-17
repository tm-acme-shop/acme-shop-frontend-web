import { useEffect } from 'react';
import { CartSummary } from '../components/cart/CartSummary';
import { createLogger } from '../logging';

const log = createLogger('cart-page');

export function CartPage() {
  useEffect(() => {
    log.info('Page view', { page: 'cart' });
  }, []);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <CartSummary />
    </div>
  );
}
