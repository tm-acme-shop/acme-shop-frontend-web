import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import { Product } from '../../types';
import { logger } from '../../logging/logger';

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard component displays a single product tile.
 *
 * TODO(TEAM-FRONTEND): Send structured analytics event on add-to-cart
 */
export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    logger.debug('Product added to cart');
    addItem(product);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
          />
        )}
        <h3 className="product-name">{product.name}</h3>
      </Link>

      <p className="product-description">{product.description}</p>

      <div className="product-footer">
        <span className="product-price">
          {formatCurrency(product.price, product.currency)}
        </span>

        <button
          onClick={handleAddToCart}
          className="add-to-cart-btn"
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
