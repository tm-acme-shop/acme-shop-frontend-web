import { Routes } from './routes';
import { UserProvider } from './store/userStore';
import { CartProvider } from './store/cartStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ENABLE_LEGACY_AUTH } from './config/featureFlags';
import { logger } from './logging/logger';

export function App() {
  if (ENABLE_LEGACY_AUTH) {
    logger.warn('Legacy auth enabled');
  }

  logger.debug('App rendered');

  return (
    <UserProvider>
      <CartProvider>
        <div className="app">
          {ENABLE_LEGACY_AUTH && (
            <div className="legacy-auth-banner">
              Legacy authentication mode is enabled. Some features may behave differently.
            </div>
          )}

          <Header />

          <main className="main-content">
            <Routes />
          </main>

          <Footer />
        </div>
      </CartProvider>
    </UserProvider>
  );
}
