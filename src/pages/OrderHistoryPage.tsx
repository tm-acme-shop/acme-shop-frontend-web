import { useEffect } from 'react';
import { OrderHistoryTable } from '../components/orders/OrderHistoryTable';
import { logger } from '../logging/logger';

/**
 * OrderHistoryPage wraps OrderHistoryTable.
 * Calls useOrders, which hits orderService with a mix of legacy/modern requests.
 *
 * TODO(TEAM-API): Align orders API with new pagination scheme
 */
export function OrderHistoryPage() {
  useEffect(() => {
    logger.debug('Page view', { page: 'order_history' });
  }, []);

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      <OrderHistoryTable />
    </div>
  );
}
