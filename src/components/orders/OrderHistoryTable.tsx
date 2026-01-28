import { Link } from 'react-router-dom';
import { Order, formatMoney, canCancel } from '@tm-acme-shop/shared';
import { useOrders } from '../../hooks/useOrders';
import { exportOrdersCsv } from '../../services/orderService';

/**
 * OrderHistoryTable displays a table of user orders.
 * Note: CSV export still uses v1 API with legacy headers.
 */
export function OrderHistoryTable() {
  const { orders, loading, error, cancel } = useOrders();

  const handleExportCsv = async () => {
    console.log('Exporting orders to CSV'); // TODO(TEAM-FRONTEND): Replace with structured logger
    try {
      const blob = await exportOrdersCsv('current-user');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log('Failed to export orders'); // TODO(TEAM-FRONTEND): Replace with structured logger
    }
  };

  const handleCancel = async (orderId: string) => {
    console.log('Cancelling order from table'); // TODO(TEAM-FRONTEND): Replace with structured logger
    try {
      await cancel(orderId);
    } catch (err) {
      console.log('Failed to cancel order'); // TODO(TEAM-FRONTEND): Replace with structured logger
    }
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="orders-error">Failed to load orders.</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>You have no orders yet.</p>
        <Link to="/products">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="order-history-header">
        <h2>Order History</h2>
        <button onClick={handleExportCsv} className="export-btn">
          Export to CSV
        </button>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onCancel={handleCancel}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface OrderRowProps {
  order: Order;
  onCancel: (orderId: string) => void;
}

function OrderRow({ order, onCancel }: OrderRowProps) {
  const handleCancelClick = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      onCancel(order.id);
    }
  };

  return (
    <tr className={`order-row order-status-${order.status}`}>
      <td>
        <Link to={`/orders/${order.id}`}>{order.id.slice(0, 8)}...</Link>
      </td>
      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
      <td>
        <span className={`status-badge status-${order.status}`}>
          {order.status}
        </span>
      </td>
      <td>{order.items.length} items</td>
      <td>{formatMoney(order.total)}</td>
      <td>
        <Link to={`/orders/${order.id}`} className="view-btn">
          View
        </Link>
        {canCancel(order) && (
          <button onClick={handleCancelClick} className="cancel-btn">
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
}
