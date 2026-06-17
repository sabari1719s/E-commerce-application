import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Trash2, ShoppingBag, CreditCard, ArrowLeft, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  // Price calculations
  const shippingCost = cartTotal > 150 || cartTotal === 0 ? 0 : 15.00;
  const estimatedTax = cartTotal * 0.08; // 8% Tax
  const finalTotal = cartTotal + shippingCost + estimatedTax;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="glass text-center" style={{ padding: '60px', borderRadius: 'var(--radius-lg)' }}>
          <ShoppingBag size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500', marginBottom: '24px' }}>
            Your shopping cart is currently empty.
          </p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Left Side: Items list */}
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item-card glass">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <Link to={`/product/${item.product}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <div className="cart-item-price">${item.price.toFixed(2)}</div>
                </div>

                {/* Quantity adjuster */}
                <div className="quantity-selector" style={{ marginBottom: 0 }}>
                  <button 
                    onClick={() => updateQty(item.product, item.qty - 1)}
                    className="qty-btn"
                    style={{ width: '28px', height: '28px' }}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="qty-value" style={{ fontSize: '14px' }}>{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.product, item.qty + 1)}
                    className="qty-btn"
                    style={{ width: '28px', height: '28px' }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: '700' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.product)}
                  className="btn btn-danger btn-sm"
                  style={{ padding: '8px', borderRadius: '50%' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <Link to="/" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', display: 'flex', gap: '6px' }}>
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>

          {/* Right Side: Order Summary */}
          <div className="summary-card glass">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: '600' }}>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping</span>
              <span>
                {shippingCost === 0 ? (
                  <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
                ) : (
                  `$${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Sales Tax (8%)</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>

            {shippingCost > 0 && (
              <p style={{ fontSize: '11px', color: 'var(--text-dark)', marginTop: '-8px', marginBottom: '16px' }}>
                Add ${(150 - cartTotal).toFixed(2)} more for FREE shipping!
              </p>
            )}

            <div className="summary-row summary-total">
              <span>Total Price</span>
              <span style={{ color: '#fff', fontSize: '20px', fontWeight: '800' }}>
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            <button 
              onClick={handleCheckout}
              className="btn btn-primary w-100 mt-4"
              style={{ height: '48px' }}
            >
              <CreditCard size={18} />
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
