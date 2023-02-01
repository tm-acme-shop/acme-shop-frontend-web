import { NavLink } from 'react-router-dom';
import { ENABLE_LEGACY_AUTH } from '../../config/featureFlags';
import { createLogger } from '../../logging/logger';

const logger = createLogger('Navigation');

interface NavItem {
  to: string;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/profile', label: 'Profile' },
];

const legacyNavItems: NavItem[] = [
  { to: '/legacy-profile', label: 'Legacy Profile' },
];

export function Navigation() {
  const handleNavClick = (item: NavItem) => {
    logger.info('Navigation click', { path: item.to });
  };

  const allNavItems = ENABLE_LEGACY_AUTH ? [...navItems, ...legacyNavItems] : navItems;

  return (
    <nav className="main-nav">
      <ul>
        {allNavItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={() => handleNavClick(item)}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
