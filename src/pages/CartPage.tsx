import { useEffect } from 'react';
import { CartSummary } from '../components/cart/CartSummary';

export function CartPage() {
  useEffect(() => {
    console.log('Page view: cart');
  }, []);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <CartSummary />
    </div>
  );
}
