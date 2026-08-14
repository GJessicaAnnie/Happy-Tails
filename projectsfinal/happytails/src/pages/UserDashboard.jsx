import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { adoptionService } from '../services/adoptionService';
import { appointmentService } from '../services/appointmentService';
import './UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('adoptions');
  const [adoptions, setAdoptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'adoptions') {
        const res = await adoptionService.getMyApplications();
        setAdoptions(res.data.applications);
      } else {
        const res = await appointmentService.getMyAppointments();
        setAppointments(res.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header-section">
          <div className="welcome-banner">
            <h1>Welcome back, {user?.fullName}! 👋</h1>
            <p>Manage your pet adoptions and appointments</p>
          </div>
          <div className="quick-actions">
            <Link to="/find-pet" className="button button--accent">
              🐾 Browse Pets
            </Link>
            <Link to="/book-appointment" className="button button--outline">
              🏥 Book Appointment
            </Link>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === 'adoptions' ? 'active' : ''}`} onClick={() => setActiveTab('adoptions')}>
            My Adoptions
          </button>
          <button className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            My Appointments
          </button>
        </div>

        {activeTab === 'adoptions' && (
          <div className="data-card">
            <div className="card-header">
              <h3>My Adoption Applications</h3>
              <span className="count-badge">{adoptions.length}</span>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Pet Name</th>
                    <th>Type</th>
                    <th>Applied On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adoptions.map(app => (
                    <tr key={app._id}>
                      <td>{app.petId?.name || 'N/A'}</td>
                      <td>{app.petId?.type || 'N/A'}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {adoptions.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🐾</div>
                <p>No adoption applications yet.</p>
                <Link to="/find-pet" className="button button--accent">Browse Available Pets</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="data-card">
            <div className="card-header">
              <h3>My Appointments</h3>
              <span className="count-badge">{appointments.length}</span>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Pet</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt._id}>
                      <td>{apt.vetName}</td>
                      <td>{apt.petName}</td>
                      <td>{new Date(apt.date).toLocaleDateString()}</td>
                      <td>{apt.timeSlot}</td>
                      <td>{apt.reason}</td>
                      <td><span className={`status-badge status-${apt.status}`}>{apt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {appointments.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🏥</div>
                <p>No appointments booked.</p>
                <Link to="/book-appointment" className="button button--accent">Book an Appointment</Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default UserDashboard;
