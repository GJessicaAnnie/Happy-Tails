import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function DoctorNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar navbar--doctor">
      <div className="navbar__inner">
        <Link className="navbar__logo" to="/doctor-dashboard">
          <span>🏥</span>
          HappyTails Doctor Portal
        </Link>

        <nav className="navbar__links" role="navigation">
          <Link className={`navbar__link ${isActive('/doctor-dashboard') ? 'active' : ''}`} to="/doctor-dashboard">
            Dashboard
          </Link>
          <Link className={`navbar__link ${isActive('/book-appointment') ? 'active' : ''}`} to="/book-appointment">
            Appointments
          </Link>
        </nav>

        <div className="navbar__actions">
          <div className="navbar__user-menu">
            <span className="navbar__user-badge">
              👨‍⚕️ Dr. {user?.fullName}
            </span>
            <span className="navbar__role-badge">Doctor</span>
            <button onClick={handleLogout} className="navbar__logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DoctorNavbar;
