import { useEffect } from 'react';
import { OrderHistoryTable } from '../components/orders/OrderHistoryTable';
import { createLogger } from '../logging/logger';

const logger = createLogger('OrderHistoryPage');

// TODO(TEAM-API): Migrate to v2 order history endpoint
export function OrderHistoryPage() {
  useEffect(() => {
    logger.info('Page view: order_history');
  }, []);

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      <OrderHistoryTable />
    </div>
  );
}
