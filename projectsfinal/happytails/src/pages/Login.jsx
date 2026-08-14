import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      
      if (response.success) {
        // Redirect based on role
        const role = response.data.user.role;
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-blob auth-blob--1"></div>
        <div className="auth-blob auth-blob--2"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="auth-card__icon">🐾</div>
            <h1 className="auth-card__title">Welcome Back</h1>
            <p className="auth-card__subtitle">Login to your HappyTails account</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__group">
              <label htmlFor="email" className="auth-form__label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="auth-form__input"
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form__group">
              <label htmlFor="password" className="auth-form__label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="auth-form__input"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form__footer">
              <Link to="/forgot-password" className="auth-form__forgot">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="button auth-form__button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="auth-form__divider">
              <span>Don't have an account?</span>
              <Link to="/signup" className="auth-form__link">
                Sign Up
              </Link>
            </div>
          </form>
        </div>

        <div className="auth-footer">
          <Link to="/" className="auth-footer__link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
