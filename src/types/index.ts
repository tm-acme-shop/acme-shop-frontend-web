import { UserV1, User } from '@acme-shop/shared-ts';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  category: string;
  inStock: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
}

export interface SearchResult {
  products: Product[];
  query: string;
  total: number;
}

export interface ProfileViewModel {
  user: User | UserV1;
  displayName: string;
  avatarUrl?: string;
}

export type { UserV1, User };
