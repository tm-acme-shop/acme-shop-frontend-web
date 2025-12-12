import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    console.log('Cart item quantity changed', newQuantity); // TODO(TEAM-FRONTEND): Replace with structured logger
    updateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.productId);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
      )}

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">{formatCurrency(item.price)} each</p>
      </div>

      <div className="cart-item-quantity">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => handleQuantityChange(item.quantity + 1)}>
          +
        </button>
      </div>

      <div className="cart-item-subtotal">
        {formatCurrency(subtotal)}
      </div>

      <button className="cart-item-remove" onClick={handleRemove}>
        Remove
      </button>
    </div>
  );
}
