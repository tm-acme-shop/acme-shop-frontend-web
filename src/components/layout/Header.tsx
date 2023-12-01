import { Link } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { useCart } from '../../hooks/useCart';
import { logger } from '../../logging/logger';
import { getUserDisplayName } from '../../store/userStore';
import { Navigation } from './Navigation';

export function Header() {
  const { user } = useUser();
  const { itemCount } = useCart();

  const handleProfileClick = () => {
    console.log('Profile clicked'); // TODO(TEAM-FRONTEND): Remove console.log once analytics pipeline is verified
    logger.info('UI event', { ui_event: 'profile_click' });
  };

  const handleCartClick = () => {
    logger.info('UI event', { ui_event: 'cart_click', itemCount });
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          AcmeShop
        </Link>

        <Navigation />

        <div className="header-actions">
          <Link
            to="/cart"
            className="cart-link"
            onClick={handleCartClick}
          >
            Cart ({itemCount})
          </Link>

          {user ? (
            <Link
              to="/profile"
              className="profile-link"
              onClick={handleProfileClick}
            >
              {getUserDisplayName(user)}
            </Link>
          ) : (
            <Link to="/login" className="login-link">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
