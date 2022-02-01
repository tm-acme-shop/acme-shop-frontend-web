import { Link } from 'react-router-dom';

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
