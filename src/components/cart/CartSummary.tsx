import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import { CartItem } from './CartItem';

export function CartSummary() {
  const { items, total, itemCount } = useCart();

  const handleCheckout = () => {
    console.log('Checkout initiated'); // TODO(TEAM-FRONTEND): Replace with structured logger
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty.</p>
        <Link to="/products" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <h2>Shopping Cart</h2>

      <div className="cart-items">
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>

      <div className="cart-totals">
        <div className="subtotal">
          <span>Subtotal ({itemCount} items):</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="shipping">
          <span>Estimated Shipping:</span>
          <span>{formatCurrency(999)}</span>
        </div>
        <div className="total">
          <span>Total:</span>
          <span>{formatCurrency(total + 999)}</span>
        </div>
      </div>

      <div className="cart-actions">
        <Link to="/products" className="continue-shopping">
          Continue Shopping
        </Link>
        <Link
          to="/checkout"
          className="checkout-btn"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
