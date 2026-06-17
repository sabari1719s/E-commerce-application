import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { Search, Filter, SortAsc } from 'lucide-react';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');
  const [error, setError] = useState(null);

  const categories = ['All', 'Electronics', 'Apparel', 'Home & Living'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/products?sort=${sort}`;
        if (category && category !== 'All') {
          url += `&category=${encodeURIComponent(category)}`;
        }
        if (search) {
          url += `&q=${encodeURIComponent(search)}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Could not fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search input updates to prevent immediate multiple requests
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, category, sort]);

  return (
    <div>
      <div className="catalog-header">
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Explore Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>Discover state of the art tech, fashion, and living products</p>
        </div>

        <div className="search-filter-bar">
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '44px' }}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ position: 'relative' }}>
            <Filter size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)', pointerEvents: 'none' }} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '44px', cursor: 'pointer', appearance: 'none' }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: 'relative' }}>
            <SortAsc size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)', pointerEvents: 'none' }} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '44px', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="latest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">
          Error loading products: {error}
        </div>
      ) : products.length === 0 ? (
        <div className="glass text-center" style={{ padding: '60px', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500' }}>
            No products match your criteria.
          </p>
        </div>
      ) : (
        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
