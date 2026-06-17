import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogIn, Key, Mail, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, setError, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    // If user is already logged in, redirect away
    if (user) {
      navigate(redirectPath, { replace: true });
    }
    setError(null);
  }, [user, navigate, redirectPath, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const success = await login(email, password);
    if (success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@store.com');
      setPassword('admin123');
    } else {
      setEmail('user@store.com');
      setPassword('user123');
    }
  };

  return (
    <div className="auth-wrapper glass">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Sign in to access your GalacticStore account</p>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dark)' }} />
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '44px' }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <Key size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dark)' }} />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '44px' }}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 mt-4"
          style={{ height: '48px' }}
        >
          <LogIn size={18} />
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        <p className="form-label" style={{ textAlign: 'center', fontSize: '12px', marginBottom: '12px' }}>
          DEVELOPER QUICK FILL
        </p>
        <div className="d-flex gap-2 justify-between">
          <button 
            onClick={() => handleQuickFill('user')}
            className="btn btn-secondary btn-sm w-100"
            style={{ fontSize: '11px', display: 'flex', gap: '4px', height: '36px' }}
          >
            <UserIconComponent size={12} />
            User Account
          </button>
          <button 
            onClick={() => handleQuickFill('admin')}
            className="btn btn-secondary btn-sm w-100"
            style={{ fontSize: '11px', display: 'flex', gap: '4px', height: '36px', borderColor: 'rgba(124, 58, 237, 0.4)' }}
          >
            <Shield size={12} style={{ color: 'var(--primary)' }} />
            Admin Account
          </button>
        </div>
      </div>

      <div className="auth-footer">
        Don't have an account? 
        <Link to="/register" className="auth-link">
          Register
        </Link>
      </div>
    </div>
  );
};

// Internal mini helper to avoid import complexity
const UserIconComponent = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default Login;
