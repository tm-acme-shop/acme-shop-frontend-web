import { Routes } from './routes';
import { UserProvider } from './store/userStore';
import { CartProvider } from './store/cartStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ENABLE_NEW_AUTH } from './config/featureFlags';
import { logger } from './logging/logger';

export function App() {
  if (ENABLE_NEW_AUTH) {
    console.log('Legacy auth enabled'); // TODO(TEAM-FRONTEND): Replace with structured logger
  }

  logger.info('App rendered', { feature: 'new_auth', enabled: ENABLE_NEW_AUTH });

  return (
    <UserProvider>
      <CartProvider>
        <div className="app">
          {ENABLE_NEW_AUTH && (
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
