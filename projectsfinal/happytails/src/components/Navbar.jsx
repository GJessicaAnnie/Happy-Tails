import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link className="navbar__logo" to="/">
          <span>🐾</span>
          HappyTails
        </Link>

        <nav className="navbar__links" role="navigation">
          <Link className={`navbar__link ${isActive('/') ? 'active' : ''}`} to="/">Home</Link>
          <Link className={`navbar__link ${isActive('/find-pet') ? 'active' : ''}`} to="/find-pet">Find a Pet</Link>
          <Link className={`navbar__link ${isActive('/rescue-care') ? 'active' : ''}`} to="/rescue-care">Rescue & Care</Link>
          <Link className={`navbar__link ${isActive('/doctors') ? 'active' : ''}`} to="/doctors">Doctors</Link>
          <Link className={`navbar__link ${isActive('/about') ? 'active' : ''}`} to="/about">About</Link>
          <Link className={`navbar__link ${isActive('/contact') ? 'active' : ''}`} to="/contact">Contact</Link>
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link className="navbar__link" to="/book-appointment">Book Appointment</Link>
              <div className="navbar__user-menu">
                <span className="navbar__user-name">Hi, {user?.fullName}</span>
                {user?.role === 'admin' && (
                  <Link className="navbar__link" to="/admin-dashboard">Dashboard</Link>
                )}
                {user?.role === 'doctor' && (
                  <Link className="navbar__link" to="/doctor-dashboard">Dashboard</Link>
                )}
                {user?.role === 'petadopt' && (
                  <Link className="navbar__link" to="/dashboard">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="navbar__logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link className="navbar__login" to="/login">Login</Link>
              <Link className="button button--accent" to="/signup" type="button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
