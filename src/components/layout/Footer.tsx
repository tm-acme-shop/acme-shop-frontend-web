import { Link } from 'react-router-dom';
import { ENABLE_LEGACY_AUTH } from '../../config/featureFlags';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Shop</h4>
          <ul>
            <li>
              <Link to="/products">All Products</Link>
            </li>
            <li>
              <Link to="/products?category=electronics">Electronics</Link>
            </li>
            <li>
              <Link to="/products?category=clothing">Clothing</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Account</h4>
          <ul>
            <li>
              <Link to="/profile">My Profile</Link>
            </li>
            <li>
              <Link to="/orders">Order History</Link>
            </li>
            {/* Legacy account settings link kept for migration */}
            {ENABLE_LEGACY_AUTH && (
              <li>
                <Link to="/legacy-profile">
                  Legacy Account Settings
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Help</h4>
          <ul>
            <li>
              <Link to="/help/shipping">Shipping Info</Link>
            </li>
            <li>
              <Link to="/help/returns">Returns</Link>
            </li>
            <li>
              <Link to="/help/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>AcmeShop</h4>
          <p>Your trusted e-commerce partner since 2020.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 AcmeShop. All rights reserved.</p>
      </div>
    </footer>
  );
}
