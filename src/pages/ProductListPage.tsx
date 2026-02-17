import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductList } from '../components/products/ProductList';
import { logger } from '../logging/logger';

/**
 * ProductListPage wraps ProductList and handles search/sort query params.
 * Comment about old vs new sort behavior.
 */
export function ProductListPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;

  logger.debug('ProductListPage mounted');

  useEffect(() => {
    document.title = category ? `${category} - AcmeShop` : 'Products - AcmeShop';
  }, [category]);

  return (
    <div className="product-list-page">
      <header className="page-header">
        <h1>{category ? `${category}` : 'All Products'}</h1>
        {search && <p>Search results for: "{search}"</p>}
      </header>

      <ProductList category={category} search={search} />
    </div>
  );
}
