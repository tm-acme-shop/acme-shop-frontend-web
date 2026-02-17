import { useState, useEffect, useCallback } from 'react';
import { getProducts, getProduct, getFeaturedProducts, searchProducts } from '../services/productService';
import { Product } from '../types';
import { createLogger } from '../logging';

const log = createLogger('use-products');

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch products.
 */
export function useProducts(options?: {
  category?: string;
  search?: string;
}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      log.info('Fetching products');
      const data = await getProducts(options);
      setProducts(data);
    } catch (err) {
      log.error('Failed to load products');
      setError(err instanceof Error ? err : new Error('Failed to load products'));
    } finally {
      setLoading(false);
    }
  }, [options?.category, options?.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

/**
 * Hook to fetch a single product by ID.
 */
export function useProduct(productId: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getProduct(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        log.error('Failed to load product', { productId });
        setError(err instanceof Error ? err : new Error('Failed to load product'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  return { product, loading, error };
}

/**
 * Hook to fetch featured products.
 */
export function useFeaturedProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getFeaturedProducts();
      setProducts(data);
    } catch (err) {
      log.error('Failed to load featured products');
      setError(err instanceof Error ? err : new Error('Failed to load featured products'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

/**
 * Hook for product search with debounce.
 */
export function useProductSearch(query: string): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!query || query.length < 2) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchProducts(query);
      setProducts(data);
    } catch (err) {
      log.error('Product search failed', { query });
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}
