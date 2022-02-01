import { useEffect } from 'react';
import { CheckoutForm } from '../components/checkout/CheckoutForm';

export function CheckoutPage() {
  useEffect(() => {
    console.log('Page view: checkout');
  }, []);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
