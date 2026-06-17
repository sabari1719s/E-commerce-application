import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import { Package, Truck, Compass, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Could not retrieve order history');
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        Error loading orders: {error}
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>Order Tracking & History</h1>

      {orders.length === 0 ? (
        <div className="glass text-center" style={{ padding: '60px', borderRadius: 'var(--radius-lg)' }}>
          <Package size={48} style={{ color: 'var(--text-dark)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500', marginBottom: '24px' }}>
            You have not placed any orders yet.
          </p>
          <Link to="/" className="btn btn-primary">
            Browse Store Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {orders.map((order) => {
            const isPending = order.status === 'pending';
            const isShipped = order.status === 'shipped';
            const isDelivered = order.status === 'delivered';

            return (
              <div key={order._id} className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-lg)' }}>
                {/* Order Meta Header */}
                <div className="d-flex justify-between align-center mb-4 flex-wrap" style={{ gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dark)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                      Order Identification
                    </span>
                    <h3 style={{ fontSize: '18px', fontFamily: 'monospace', color: 'var(--secondary)' }}>
                      #{order._id}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-dark)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                      Placed On
                    </span>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-dark)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                      Amount Charged
                    </span>
                    <p style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Items & Shipping row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', margin: '24px 0' }} className="flex-wrap">
                  {/* Items purchased */}
                  <div>
                    <h4 style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      Purchased Items ({order.orderItems.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.orderItems.map((item) => (
                        <div key={item._id} className="d-flex align-center gap-2" style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                          />
                          <div style={{ flexGrow: 1 }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '30px' }}>
                    <h4 style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      Delivery Location
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '600' }}>
                      {order.shippingAddress.address}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div style={{ marginTop: '40px' }}>
                  <h4 style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Shipment Delivery Status
                  </h4>
                  <div className="tracking-stepper">
                    {/* Step 1: Pending (Paid) */}
                    <div className={`step-indicator ${isPending || isShipped || isDelivered ? 'completed' : ''}`}>
                      <div className="step-dot">
                        <Package size={14} />
                      </div>
                      <span className="step-label">Processing</span>
                    </div>

                    {/* Step 2: Shipped */}
                    <div className={`step-indicator ${isShipped ? 'active' : isDelivered ? 'completed' : ''}`}>
                      <div className="step-dot">
                        <Truck size={14} />
                      </div>
                      <span className="step-label">Shipped</span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className={`step-indicator ${isDelivered ? 'completed' : ''}`}>
                      <div className="step-dot">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="step-label">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
