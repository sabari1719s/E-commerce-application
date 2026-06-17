import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { 
  ShoppingCart, 
  LogOut, 
  ShoppingBag, 
  ClipboardList, 
  LayoutDashboard, 
  PackageSearch,
  User as UserIcon
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="brand-logo">
          <ShoppingBag size={26} strokeWidth={2.5} style={{ marginRight: '6px', color: '#7c3aed' }} />
          GalacticStore
        </Link>

        <nav>
          <ul className="nav-menu">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                <PackageSearch size={18} />
                Products
              </Link>
            </li>

            <li>
              <Link to="/cart" className={`nav-link cart-trigger ${isActive('/cart') ? 'active' : ''}`}>
                <ShoppingCart size={18} />
                Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            </li>

            {user ? (
              <>
                {/* Admin specific controls */}
                {user.role === 'admin' ? (
                  <>
                    <li>
                      <Link 
                        to="/admin/dashboard" 
                        className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                      >
                        <LayoutDashboard size={18} />
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/admin/products" 
                        className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`}
                      >
                        <ShoppingBag size={18} />
                        Catalog CRUD
                      </Link>
                    </li>
                  </>
                ) : (
                  // User specific controls
                  <li>
                    <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                      <ClipboardList size={18} />
                      My Orders
                    </Link>
                  </li>
                )}

                {/* User info & Logout */}
                <li className="nav-link" style={{ cursor: 'default', color: 'var(--text-main)', borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
                  <UserIcon size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {user.name.split(' ')[0]} {user.role === 'admin' && '(Admin)'}
                  </span>
                </li>

                <li>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LogOut size={14} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Guest links
              <>
                <li>
                  <Link to="/login" className="nav-link">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
