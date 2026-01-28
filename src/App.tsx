import { Routes } from './routes';
import { UserProvider } from './store/userStore';
import { CartProvider } from './store/cartStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ENABLE_LEGACY_AUTH } from './config/featureFlags';

export function App() {
  if (ENABLE_LEGACY_AUTH) {
    console.log('Legacy auth enabled'); // TODO(TEAM-FRONTEND): Replace with structured logger
  }

  console.log('App rendered'); // TODO(TEAM-FRONTEND): Replace with structured logger

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
