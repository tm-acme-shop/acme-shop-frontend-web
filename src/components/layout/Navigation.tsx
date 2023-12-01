import { NavLink } from 'react-router-dom';
import { ENABLE_LEGACY_AUTH } from '../../config/featureFlags';
import { logger } from '../../logging/logger';

interface NavItem {
  to: string;
  label: string;
  legacy?: boolean;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/profile', label: 'Profile' },
];

const legacyNavItems: NavItem[] = [
  { to: '/legacy-profile', label: 'Legacy Profile', legacy: true },
];

export function Navigation() {
  const handleNavClick = (item: NavItem) => {
    logger.info('Navigation click', { path: item.to, legacy: item.legacy });
  };

  const allItems = ENABLE_LEGACY_AUTH
    ? [...navItems, ...legacyNavItems]
    : navItems;

  return (
    <nav className="main-nav">
      <ul>
        {allItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={() => handleNavClick(item)}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.label}
              {item.legacy && <span className="legacy-badge">Legacy</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
