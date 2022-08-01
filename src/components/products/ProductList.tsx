import { useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { createLogger } from '../../logging/logger';

const logger = createLogger('ProductList');

interface ProductListProps {
  category?: string;
  search?: string;
}

export function ProductList({ category, search }: ProductListProps) {
  const { products, loading, error } = useProducts({ category, search });

  useEffect(() => {
    logger.info('ProductList mounted', { category, search });
  }, [category, search]);

  if (loading) {
    return (
      <div className="product-list-loading">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    logger.error('Failed to load products', { error: error.message });
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
