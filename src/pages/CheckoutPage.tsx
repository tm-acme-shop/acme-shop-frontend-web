import { useEffect } from 'react';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { logger } from '../logging/logger';

export function CheckoutPage() {
  const legacyPayments = useFeatureFlag('enableLegacyPayments');

  useEffect(() => {
    logger.info('Page view', { page: 'checkout' });
  }, []);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {legacyPayments && (
        <div className="legacy-payment-notice">
          Notice: Legacy payment provider is in use. Some features may be limited.
        </div>
      )}

      <CheckoutForm />
    </div>
  );
}
