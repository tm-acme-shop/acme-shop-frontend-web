import { modernRequest } from './httpClient';
import { API_BASE_URL_V2 } from '../config/apiConfig';
import { Product, ProductListResponse } from '../types';
import { createLogger } from '../logging';

const log = createLogger('product-service');

/**
 * Get all products.
 * This service has already migrated off v1 APIs and legacy headers.
 *
 * TODO(TEAM-FRONTEND): Add structured logging for product impressions
 */
export async function getProducts(options?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  log.info('Fetching products');

  const params = new URLSearchParams();
  if (options?.category) params.append('category', options.category);
  if (options?.search) params.append('search', options.search);
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.offset) params.append('offset', String(options.offset));

  const queryString = params.toString();
  const url = `${API_BASE_URL_V2}/products${queryString ? `?${queryString}` : ''}`;

  const response = await modernRequest<ProductListResponse>('GET', url);
  return response.data.products;
}

/**
 * Get a single product by ID.
 */
export async function getProduct(productId: string): Promise<Product> {
  log.info('Fetching product', { productId });

  const response = await modernRequest<Product>(
    'GET',
    `${API_BASE_URL_V2}/products/${productId}`
  );
  return response.data;
}

/**
 * Get featured products for homepage.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  log.info('Fetching featured products');

  const response = await modernRequest<ProductListResponse>(
    'GET',
    `${API_BASE_URL_V2}/products/featured`
  );
  return response.data.products;
}

/**
 * Search products by query.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  log.info('Searching products', { query });

  return getProducts({ search: query });
}
