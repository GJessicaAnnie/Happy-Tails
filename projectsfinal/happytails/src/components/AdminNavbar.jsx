import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar navbar--admin">
      <div className="navbar__inner">
        <Link className="navbar__logo" to="/admin-dashboard">
          <span>🐾</span>
          HappyTails Admin
        </Link>

        <nav className="navbar__links" role="navigation">
          <Link className={`navbar__link ${isActive('/admin-dashboard') ? 'active' : ''}`} to="/admin-dashboard">
            Dashboard
          </Link>
          <Link className={`navbar__link ${isActive('/find-pet') ? 'active' : ''}`} to="/find-pet">
            View Pets
          </Link>
          <Link className={`navbar__link ${isActive('/doctors') ? 'active' : ''}`} to="/doctors">
            View Doctors
          </Link>
        </nav>

        <div className="navbar__actions">
          <div className="navbar__user-menu">
            <span className="navbar__user-badge">
              👤 {user?.fullName}
            </span>
            <span className="navbar__role-badge">Admin</span>
            <button onClick={handleLogout} className="navbar__logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
