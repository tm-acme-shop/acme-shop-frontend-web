import { Link } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { useCart } from '../../hooks/useCart';
import { getUserDisplayName } from '../../store/userStore';
import { Navigation } from './Navigation';
import { createLogger } from '../../logging';

const log = createLogger('header');

export function Header() {
  const { user } = useUser();
  const { itemCount } = useCart();

  const handleProfileClick = () => {
    log.info('Profile clicked');
  };

  const handleCartClick = () => {
    log.info('UI event: cart_click');
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
