import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Stop redirection to detail page
    addToCart(product, 1);
  };

  return (
    <div className="product-card glass">
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-card-image"
            loading="lazy" 
          />
          {isOutOfStock ? (
            <span className="product-card-badge" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              Sold Out
            </span>
          ) : product.stock <= 5 ? (
            <span className="product-card-badge" style={{ color: 'var(--warning)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              Only {product.stock} Left
            </span>
          ) : (
            <span className="product-card-badge">
              In Stock
            </span>
          )}
        </div>

        <div className="product-content">
          <span className="product-card-category">{product.category}</span>
          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-description">{product.description}</p>
          
          <div className="product-card-footer">
            <span className="product-card-price">${product.price.toFixed(2)}</span>
            <button 
              onClick={handleAddToCart}
              className={`btn btn-sm ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
              disabled={isOutOfStock}
              style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ShoppingCart size={14} />
              {isOutOfStock ? 'Out of Stock' : 'Add'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
