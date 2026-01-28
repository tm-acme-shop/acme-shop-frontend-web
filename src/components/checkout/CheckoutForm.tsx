import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useUser } from '../../hooks/useUser';
import { processPayment } from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatCurrency';

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
}

/**
 * CheckoutForm handles payment and address entry.
 *
 * TODO(TEAM-SEC): Add client-side validation to prevent invalid card data
 */
export function CheckoutForm() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useUser();

  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    console.log('Checkout submit'); // TODO(TEAM-FRONTEND): Replace with structured logger

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await processPayment(
        `order-${Date.now()}`,
        user.id,
        { amount: total + 999, currency: 'USD' },
        'tok_test_card'
      );

      if (response.status === 'completed' || response.status === 'pending') {
        clearCart();
        navigate(`/orders/${response.paymentId}/confirmation`);
      } else {
        throw new Error('Payment failed');
      }
    } catch (err) {
      console.log('Checkout failed'); // TODO(TEAM-FRONTEND): Replace with structured logger
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Payment Information</h2>

      {error && <div className="checkout-error">{error}</div>}

      <div className="form-section">
        <h3>Card Details</h3>

        <div className="form-group">
          <label htmlFor="cardholderName">Cardholder Name</label>
          <input
            type="text"
            id="cardholderName"
            name="cardholderName"
            value={formData.cardholderName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Billing Address</h3>

        <div className="form-group">
          <label htmlFor="billingAddress">Address</label>
          <input
            type="text"
            id="billingAddress"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="billingCity">City</label>
            <input
              type="text"
              id="billingCity"
              name="billingCity"
              value={formData.billingCity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="billingState">State</label>
            <input
              type="text"
              id="billingState"
              name="billingState"
              value={formData.billingState}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="billingZip">ZIP Code</label>
            <input
              type="text"
              id="billingZip"
              name="billingZip"
              value={formData.billingZip}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="checkout-summary">
        <div className="total-line">
          <span>Order Total:</span>
          <span>{formatCurrency(total + 999)}</span>
        </div>
      </div>

      <button
        type="submit"
        className="submit-payment-btn"
        disabled={submitting || items.length === 0}
      >
        {submitting ? 'Processing...' : 'Complete Purchase'}
      </button>
    </form>
  );
}
