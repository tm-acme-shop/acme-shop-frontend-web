import { User } from '@acme-shop/shared-ts';

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
 * References User/UserV1 in composite types.
 */
export interface ProfileViewModel {
  user: User;
  isLegacy: boolean;
  displayName: string;
  initials: string;
}

export function createProfileViewModel(user: User, isLegacy: boolean): ProfileViewModel {
  let displayName: string;
  let initials: string;

  if ('firstName' in user) {
    displayName = `${user.firstName} ${user.lastName}`;
    initials = `${user.firstName[0]}${user.lastName[0]}`;
  } else {
    displayName = user.name;
    const parts = user.name.split(' ');
    initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
  }

  return {
    user,
    isLegacy,
    displayName,
    initials,
  };
}
