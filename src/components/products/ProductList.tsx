import { useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { logger } from '../../logging/logger';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  category?: string;
  search?: string;
}

/**
 * ProductList component renders a grid of products.
 * This component is fully on v2 APIs.
 */
export function ProductList({ category, search }: ProductListProps) {
  const { products, loading, error } = useProducts({ category, search });

  useEffect(() => {
    logger.info('ProductList mounted', { event: 'view_product_list' });
  }, []);

  if (loading) {
    return (
      <div className="product-list-loading">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-error">
        <p>Failed to load products. Please try again.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list-empty">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
