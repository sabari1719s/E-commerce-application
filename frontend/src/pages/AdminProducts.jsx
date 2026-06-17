import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import { Plus, Edit2, Trash2, X, Package } from 'lucide-react';

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');

  const categories = ['Electronics', 'Apparel', 'Home & Living'];

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error('Failed to retrieve catalog products');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Electronics');
    setStock('');
    setImage('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
    setImage(product.image);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you absolutely sure you want to remove this product from the catalog?')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to remove product.');
      }

      fetchProducts();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || price === '' || stock === '') {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      image: image.trim() || undefined, // fallback to schema default if blank
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to submit product changes.');
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(`Submit error: ${err.message}`);
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
        Error loading product list: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-between align-center mb-8 flex-wrap" style={{ gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Manage Store Inventory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Perform full catalog updates, price modifications, and warehouse restocking</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} />
          Create New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="glass text-center" style={{ padding: '60px', borderRadius: 'var(--radius-lg)' }}>
          <Package size={48} style={{ color: 'var(--text-dark)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500', marginBottom: '20px' }}>
            No products exist in your inventory database.
          </p>
          <button onClick={openAddModal} className="btn btn-primary">
            Create First Product
          </button>
        </div>
      ) : (
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Levels</th>
                  <th style={{ textAlign: 'center' }}>Modify / Delete</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} 
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>{product.name}</div>
                      <div 
                        style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}
                        title={product.description}
                      >
                        {product.description}
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td style={{ fontWeight: '700' }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td>
                      {product.stock === 0 ? (
                        <span style={{ color: 'var(--danger)', fontWeight: '700' }}>Out of Stock</span>
                      ) : product.stock <= 5 ? (
                        <span style={{ color: 'var(--warning)', fontWeight: '600' }}>Low Stock ({product.stock})</span>
                      ) : (
                        <span style={{ color: 'var(--success)', fontWeight: '600' }}>{product.stock} units</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(product)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Edit2 size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h2 style={{ fontSize: '22px' }}>
                {editingProduct ? 'Update Product Entry' : 'Create Catalog Product'}
              </h2>
              <button onClick={handleModalClose} className="modal-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Cosmic Sound Pro Headphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Features *</label>
                <textarea
                  placeholder="Summarize product parameters and warranty..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  style={{ minHeight: '90px', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Unit Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="99.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Stock Count *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-control"
                    style={{ cursor: 'pointer' }}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... (optional)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="d-flex justify-between mt-8" style={{ gap: '16px' }}>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="btn btn-secondary w-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  {editingProduct ? 'Save Modifications' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
