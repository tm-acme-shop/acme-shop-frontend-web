import { User } from '@tm-acme-shop/shared';

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

/**
 * Profile view model that bridges shared-ts models and UI.
 */
export interface ProfileViewModel {
  user: User;
  isLegacy: boolean;
  displayName: string;
  initials: string;
}

export function createProfileViewModel(user: User, isLegacy: boolean): ProfileViewModel {
  const displayName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return {
    user,
    isLegacy,
    displayName,
    initials,
  };
}
