import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import { Truck, CheckCircle, Clock, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve system orders');
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update order status');
      }

      // Re-fetch orders list on status update success
      fetchOrders();
    } catch (err) {
      alert(`Error updating order: ${err.message}`);
    }
  };

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
        Error loading admin dashboard: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Store Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage customer order tracking statuses, invoices, and logistics</p>
      </div>

      {orders.length === 0 ? (
        <div className="glass text-center" style={{ padding: '60px', borderRadius: 'var(--radius-lg)' }}>
          <Clock size={48} style={{ color: 'var(--text-dark)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500' }}>
            No customer orders have been placed yet.
          </p>
        </div>
      ) : (
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} style={{ color: 'var(--primary)' }} />
            Customer Purchase Orders ({orders.length})
          </h2>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date Placed</th>
                  <th>Total Charged</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'center' }}>Logistics Override Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--secondary)', fontWeight: '600' }}>
                      #{order._id}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{order.user?.name || 'Deleted Account'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Items: {order.orderItems.reduce((acc, item) => acc + item.qty, 0)}
                      </div>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td style={{ fontWeight: '700' }}>
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge-status badge-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'shipped')}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}
                          >
                            <Truck size={14} />
                            Dispatch Shipment
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'delivered')}
                            className="btn btn-primary btn-sm"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              padding: '6px 12px',
                              background: 'linear-gradient(135deg, var(--success), #059669)',
                              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <CheckCircle size={14} />
                            Mark Delivered
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <span style={{ color: 'var(--success)', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={14} />
                            Fulfilled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
