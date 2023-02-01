import { Routes } from './routes';
import { UserProvider } from './store/userStore';
import { CartProvider } from './store/cartStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ENABLE_LEGACY_AUTH } from './config/featureFlags';
import { createLogger } from './logging/logger';

const logger = createLogger('App');

export function App() {
  console.log('App rendered');
  logger.info('App rendered', { legacyAuth: ENABLE_LEGACY_AUTH });

  return (
    <UserProvider>
      <CartProvider>
        <div className="app">
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
