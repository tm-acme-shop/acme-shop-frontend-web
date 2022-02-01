import { useEffect } from 'react';
import { OrderHistoryTable } from '../components/orders/OrderHistoryTable';

export function OrderHistoryPage() {
  useEffect(() => {
    console.log('Page view: order_history');
  }, []);

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      <OrderHistoryTable />
    </div>
  );
}
