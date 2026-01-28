import { useEffect } from 'react';
import { OrderHistoryTable } from '../components/orders/OrderHistoryTable';

/**
 * OrderHistoryPage wraps OrderHistoryTable.
 * Calls useOrders, which hits orderService with a mix of legacy/modern requests.
 *
 * TODO(TEAM-API): Align orders API with new pagination scheme
 */
export function OrderHistoryPage() {
  useEffect(() => {
    console.log('Page view', { page: 'order_history' }); // TODO(TEAM-FRONTEND): Replace with structured logger
  }, []);

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      <OrderHistoryTable />
    </div>
  );
}
