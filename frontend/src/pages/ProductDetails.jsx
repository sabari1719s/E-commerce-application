import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Spinner from '../components/Spinner.jsx';
import { ShoppingCart, ArrowLeft, Plus, Minus, PackageOpen } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Could not fetch product details');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQtyChange = (action) => {
    if (action === 'increase') {
      if (qty < product.stock) {
        setQty(qty + 1);
      }
    } else {
      if (qty > 1) {
        setQty(qty - 1);
      }
    }
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="alert alert-danger mb-4">
          {error || 'Product details unavailable'}
        </div>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div>
      <Link to="/" className="btn btn-secondary btn-sm mb-8" style={{ display: 'inline-flex', gap: '6px' }}>
        <ArrowLeft size={16} />
        Back to Catalog
      </Link>

      <div className="detail-grid">
        {/* Left Side: Product Image */}
        <div className="detail-image-box">
          <img src={product.image} alt={product.name} className="detail-img" />
        </div>

        {/* Right Side: Product Details */}
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-price">${product.price.toFixed(2)}</div>
          
          <p className="detail-desc">{product.description}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <span className="form-label" style={{ marginBottom: '0px' }}>Availability Status</span>
            <div className="stock-indicator">
              <PackageOpen size={18} style={{ color: isOutOfStock ? 'var(--danger)' : 'var(--success)' }} />
              {isOutOfStock ? (
                <span className="stock-out">Sold Out (Out of Stock)</span>
              ) : product.stock <= 5 ? (
                <span className="stock-out" style={{ color: 'var(--warning)' }}>
                  Low Stock: Only {product.stock} items remaining!
                </span>
              ) : (
                <span className="stock-in">In Stock ({product.stock} units available)</span>
              )}
            </div>
          </div>

          {!isOutOfStock && (
            <div className="form-group">
              <label className="form-label">Select Quantity</label>
              <div className="quantity-selector">
                <button 
                  onClick={() => handleQtyChange('decrease')}
                  disabled={qty <= 1}
                  className="qty-btn"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{qty}</span>
                <button 
                  onClick={() => handleQtyChange('increase')}
                  disabled={qty >= product.stock}
                  className="qty-btn"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'} w-100`}
            style={{ height: '52px', fontSize: '16px' }}
          >
            <ShoppingCart size={18} />
            {isOutOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
