import { modernRequest } from './httpClient';
import { API_BASE_URL_V2 } from '../config/apiConfig';
import { Product, ProductListResponse } from '../types';
import { createLogger } from '../logging/logger';

const logger = createLogger('productService');

export async function getProducts(options?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  logger.info('Fetching products', { options });

  const params = new URLSearchParams();
  if (options?.category) params.append('category', options.category);
  if (options?.search) params.append('search', options.search);
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.offset) params.append('offset', String(options.offset));

  const queryString = params.toString();
  const url = `${API_BASE_URL_V2}/products${queryString ? `?${queryString}` : ''}`;

  const response = await modernRequest<ProductListResponse>('GET', url);
  logger.info('Products fetched', { count: response.data.products.length });
  return response.data.products;
}

export async function getProduct(productId: string): Promise<Product> {
  logger.info('Fetching product', { productId });

  const response = await modernRequest<Product>(
    'GET',
    `${API_BASE_URL_V2}/products/${productId}`
  );
  return response.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  logger.info('Fetching featured products');

  const response = await modernRequest<ProductListResponse>(
    'GET',
    `${API_BASE_URL_V2}/products/featured`
  );
  return response.data.products;
}

export async function searchProducts(query: string): Promise<Product[]> {
  logger.info('Searching products', { query });

  return getProducts({ search: query });
}
