import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldCheck, CreditCard, ArrowLeft, Landmark } from 'lucide-react';
import Spinner from '../components/Spinner.jsx';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If cart is empty, send back to catalog
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  // Price calculations
  const shippingCost = cartTotal > 150 ? 0 : 15.00;
  const estimatedTax = cartTotal * 0.08;
  const finalTotal = cartTotal + shippingCost + estimatedTax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country || !cardNumber || !cardExpiry || !cardCvv) {
      setError('Please fill in all shipping and payment details.');
      return;
    }

    setLoading(true);
    setError(null);

    const orderPayload = {
      orderItems: cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: item.qty,
      })),
      shippingAddress: {
        address,
        city,
        postalCode,
        country,
      },
      totalPrice: finalTotal,
    };

    try {
      // Post order details to API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order.');
      }

      // Simulate network wait for authorization processing
      setTimeout(() => {
        clearCart();
        setLoading(false);
        navigate('/orders');
      }, 1500);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass text-center" style={{ padding: '60px', borderRadius: 'var(--radius-lg)', maxWidth: '500px', margin: '40px auto' }}>
        <Spinner />
        <h2 style={{ marginTop: '24px', fontSize: '20px' }}>Processing Payment...</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
          Please do not refresh or close this browser window. Securing connection with clearing house...
        </p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate('/cart')} className="btn btn-secondary btn-sm mb-8" style={{ display: 'inline-flex', gap: '6px' }}>
        <ArrowLeft size={16} />
        Back to Cart
      </button>

      <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>Checkout</h1>

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="cart-layout">
        {/* Left Side: Shipping & Payment Form */}
        <div className="d-flex flex-column gap-4">
          {/* Shipping Coordinates */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Landmark size={20} style={{ color: 'var(--primary)' }} />
              Shipping Coordinates
            </h2>

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                placeholder="123 Galactic Way, Apt 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  placeholder="Neo Tokyo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal / Zip Code</label>
                <input
                  type="text"
                  placeholder="94016"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Country</label>
              <input
                type="text"
                placeholder="United Sector"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Secure Payment details */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} style={{ color: 'var(--secondary)' }} />
              Secure Payment Simulator
            </h2>

            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                placeholder="4000 1234 5678 9010"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                maxLength="19"
                className="form-control"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Expiration Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  maxLength="5"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">CVV / CVC Code</label>
                <input
                  type="password"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  maxLength="3"
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Summary & Action */}
        <div className="summary-card glass">
          <h2 className="summary-title">Order Total</h2>

          {cartItems.map((item) => (
            <div key={item.product} className="d-flex justify-between mb-4" style={{ fontSize: '14px' }}>
              <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                {item.qty}x {item.name}
              </span>
              <span style={{ fontWeight: '500' }}>
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Shipping cost</span>
              <span>
                {shippingCost === 0 ? (
                  <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
                ) : (
                  `$${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Tax estimate (8%)</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>

            <div className="summary-row summary-total">
              <span>Final Total</span>
              <span style={{ color: 'var(--secondary)', fontSize: '20px', fontWeight: '800' }}>
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            style={{ height: '52px', fontSize: '15px' }}
          >
            <ShieldCheck size={18} />
            Authorize Order Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
