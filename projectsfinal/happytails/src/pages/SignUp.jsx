import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'petadopt',
    specialization: '',
    experience: ''
  });
  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Show/hide doctor fields based on role selection
    if (name === 'role') {
      setShowDoctorFields(value === 'doctor');
    }
    
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'doctor' && (!formData.specialization || !formData.experience)) {
      setError('Please fill in specialization and experience for doctor account');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await signup(formData);
      
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
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
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
            <h1 className="auth-card__title">Create Account</h1>
            <p className="auth-card__subtitle">Join HappyTails and find your perfect companion</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__group">
              <label htmlFor="fullName" className="auth-form__label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="auth-form__input"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

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
                placeholder="At least 6 characters"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form__group">
              <label htmlFor="confirmPassword" className="auth-form__label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="auth-form__input"
                placeholder="Re-enter your password"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form__group">
              <label htmlFor="role" className="auth-form__label">
                I want to *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="auth-form__input"
                required
                disabled={loading}
              >
                <option value="petadopt">Adopt a Pet</option>
                <option value="doctor">Join as Doctor</option>
              </select>
            </div>

            {showDoctorFields && (
              <>
                <div className="auth-form__group">
                  <label htmlFor="specialization" className="auth-form__label">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="auth-form__input"
                    placeholder="e.g., Small Animals, Surgery, Dental"
                    required={formData.role === 'doctor'}
                    disabled={loading}
                  />
                </div>

                <div className="auth-form__group">
                  <label htmlFor="experience" className="auth-form__label">
                    Experience *
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="auth-form__input"
                    placeholder="e.g., 5 years, 10 years"
                    required={formData.role === 'doctor'}
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="button auth-form__button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="auth-form__divider">
              <span>Already have an account?</span>
              <Link to="/login" className="auth-form__link">
                Login
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

export default SignUp;
