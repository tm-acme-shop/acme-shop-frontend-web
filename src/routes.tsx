import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { ENABLE_NEW_AUTH } from './config/featureFlags';
import {
  HomePage,
  ProductListPage,
  CartPage,
  CheckoutPage,
  OrderHistoryPage,
  UserProfilePage,
} from './pages';

/**
 * Application routes.
 *
 * TODO(TEAM-FRONTEND): Remove /legacy-profile route once all users migrated
 */
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

      {/* Legacy profile route kept for migration */}
      {ENABLE_NEW_AUTH && (
        <Route path="/legacy-profile" element={<UserProfilePage />} />
      )}

      {/* Fallback route */}
      <Route path="*" element={<HomePage />} />
    </RouterRoutes>
  );
}
