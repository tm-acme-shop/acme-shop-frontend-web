import { useState, useEffect, useCallback } from 'react';
import { getProducts, getProduct, getFeaturedProducts, searchProducts } from '../services/productService';
import { Product } from '../types';

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
      console.log('Fetching products', options);
      const data = await getProducts(options);
      setProducts(data);
    } catch (err) {
      console.log('Failed to load products', String(err));
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
        console.log('Failed to load product', productId, String(err));
        setError(err instanceof Error ? err : new Error('Failed to load product'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  return { product, loading, error };
}

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
      console.log('Failed to load featured products', String(err));
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
      console.log('Product search failed', query, String(err));
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
