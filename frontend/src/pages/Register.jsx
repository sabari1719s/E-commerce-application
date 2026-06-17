import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserPlus, User, Mail, Key } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { register, error, setError, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    setError(null);
  }, [user, navigate, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    const success = await register(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-wrapper glass">
      <h2 className="auth-title">Create Account</h2>
      <p className="auth-subtitle">Sign up to start shopping on GalacticStore</p>

      {(validationError || error) && (
        <div className="alert alert-danger">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dark)' }} />
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '44px' }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dark)' }} />
            <input
              type="email"
              placeholder="john@example.com"
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

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <Key size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dark)' }} />
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          <UserPlus size={18} />
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? 
        <Link to="/login" className="auth-link">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
