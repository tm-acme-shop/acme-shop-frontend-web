import { legacyRequest } from './httpClient';
import { API_BASE_URL_V1 } from '../config/apiConfig';
import { Product, ProductListResponse } from '../types';

export async function getProducts(options?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  console.log('Fetching products', options);

  const params = new URLSearchParams();
  if (options?.category) params.append('category', options.category);
  if (options?.search) params.append('search', options.search);
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.offset) params.append('offset', String(options.offset));

  const queryString = params.toString();
  const url = `${API_BASE_URL_V1}/products${queryString ? `?${queryString}` : ''}`;

  const response = await legacyRequest<ProductListResponse>('GET', url);
  return response.data.products;
}

export async function getProduct(productId: string): Promise<Product> {
  console.log('Fetching product', productId);

  const response = await legacyRequest<Product>(
    'GET',
    `${API_BASE_URL_V1}/products/${productId}`
  );
  return response.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  console.log('Fetching featured products');

  const response = await legacyRequest<ProductListResponse>(
    'GET',
    `${API_BASE_URL_V1}/products/featured`
  );
  return response.data.products;
}

export async function searchProducts(query: string): Promise<Product[]> {
  console.log('Searching products', query);

  return getProducts({ search: query });
}
