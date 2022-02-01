import { Routes as RouterRoutes, Route } from 'react-router-dom';
import {
  HomePage,
  ProductListPage,
  CartPage,
  CheckoutPage,
  OrderHistoryPage,
  UserProfilePage,
} from './pages';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:productId" element={<ProductListPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />
      <Route path="/orders/:orderId" element={<OrderHistoryPage />} />
      <Route path="/profile" element={<UserProfilePage />} />

      {/* Fallback route */}
      <Route path="*" element={<HomePage />} />
    </RouterRoutes>
  );
}
