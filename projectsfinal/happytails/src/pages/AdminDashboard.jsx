import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { adminService } from '../services/adminService';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [data, setData] = useState({ users: [], doctors: [], pets: [], appointments: [], adoptions: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const statsRes = await adminService.getDashboardStats();
        setStats(statsRes.data);
      } else if (activeTab === 'users') {
        const res = await adminService.getAllUsers({ role: 'petadopt' });
        setData(prev => ({ ...prev, users: res.data.users }));
      } else if (activeTab === 'doctors') {
        const res = await adminService.getAllDoctors();
        setData(prev => ({ ...prev, doctors: res.data.doctors }));
      } else if (activeTab === 'pets') {
        const res = await adminService.getAllPets();
        setData(prev => ({ ...prev, pets: res.data.pets }));
      } else if (activeTab === 'appointments') {
        const res = await adminService.getAllAppointments();
        setData(prev => ({ ...prev, appointments: res.data.appointments }));
      } else if (activeTab === 'adoptions') {
        const res = await adminService.getAllAdoptions();
        setData(prev => ({ ...prev, adoptions: res.data.adoptions }));
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

  const openModal = (type, item = null) => {
    setModalType(type);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    
    try {
      if (type === 'user') await adminService.deleteUser(id);
      else if (type === 'doctor') await adminService.deleteDoctor(id);
      else if (type === 'pet') await adminService.deletePet(id);
      else if (type === 'appointment') await adminService.deleteAppointment(id);
      fetchData();
    } catch (error) {
      alert('Error deleting item');
    }
  };

  const handleStatusUpdate = async (type, id, status) => {
    try {
      if (type === 'appointment') {
        await adminService.updateAppointmentStatus(id, { status });
      } else if (type === 'adoption') {
        await adminService.updateAdoptionStatus(id, { status });
      }
      fetchData();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const viewApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedApplication(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'addPet') {
        await adminService.createPet(formData);
      } else if (modalType === 'addDoctor') {
        await adminService.createDoctor(formData);
      }
      closeModal();
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Error saving item';
      alert(message);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'pets', label: 'Pets' },
    { id: 'users', label: 'Users' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'adoptions', label: 'Adoptions' }
  ];

  if (loading && !stats) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header-section">
          <div className="welcome-banner welcome-banner--admin">
            <h1>Admin Dashboard 🛡️</h1>
            <p>Manage pets, users, doctors, and adoption requests</p>
          </div>
        </div>

        <div className="dashboard-stats">
          {stats && (
            <>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.users}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-info">
                  <h3>{stats.doctors}</h3>
                  <p>Total Doctors</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🐾</div>
                <div className="stat-info">
                  <h3>{stats.pets}</h3>
                  <p>Total Pets</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.availablePets}</h3>
                  <p>Available Pets</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏥</div>
                <div className="stat-info">
                  <h3>{stats.appointments}</h3>
                  <p>Appointments</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>{stats.adoptions}</h3>
                  <p>Adoptions</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="dashboard-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="value">{stats.users}</div>
            </div>
            <div className="stat-card">
              <h3>Total Doctors</h3>
              <div className="value">{stats.doctors}</div>
            </div>
            <div className="stat-card">
              <h3>Total Pets</h3>
              <div className="value">{stats.pets}</div>
            </div>
            <div className="stat-card">
              <h3>Available Pets</h3>
              <div className="value">{stats.availablePets}</div>
            </div>
            <div className="stat-card">
              <h3>Appointments</h3>
              <div className="value">{stats.appointments}</div>
            </div>
            <div className="stat-card">
              <h3>Adoptions</h3>
              <div className="value">{stats.adoptions}</div>
            </div>
          </div>
        )}

        {activeTab === 'pets' && (
          <div className="data-table">
            <button className="submit-btn" onClick={() => openModal('addPet')} style={{ marginBottom: '20px' }}>
              Add New Pet
            </button>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.pets.map(pet => (
                  <tr key={pet._id}>
                    <td>{pet.name}</td>
                    <td>{pet.type}</td>
                    <td>{pet.breed}</td>
                    <td>{pet.age}</td>
                    <td><span className={`status-badge status-${pet.status}`}>{pet.status}</span></td>
                    <td>
                      <button className="action-btn delete-btn" onClick={() => handleDelete('pet', pet._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(u => (
                  <tr key={u._id}>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>{u.role}</td>
                    <td>
                      <button className="action-btn delete-btn" onClick={() => handleDelete('user', u._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="data-table">
            <button className="submit-btn" onClick={() => openModal('addDoctor')} style={{ marginBottom: '20px' }}>
              Add New Doctor
            </button>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.doctors.map(doc => (
                  <tr key={doc._id}>
                    <td>{doc.fullName}</td>
                    <td>{doc.email}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.experience}</td>
                    <td>{doc.isAvailable ? 'Yes' : 'No'}</td>
                    <td>
                      <button className="action-btn delete-btn" onClick={() => handleDelete('doctor', doc._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Pet</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.appointments.map(apt => (
                  <tr key={apt._id}>
                    <td>{apt.userId?.fullName}</td>
                    <td>{apt.petName}</td>
                    <td>{apt.vetId?.fullName}</td>
                    <td>{new Date(apt.date).toLocaleDateString()}</td>
                    <td><span className={`status-badge status-${apt.status}`}>{apt.status}</span></td>
                    <td>
                      {apt.status === 'pending' && (
                        <>
                          <button className="action-btn approve-btn" onClick={() => handleStatusUpdate('appointment', apt._id, 'confirmed')}>Confirm</button>
                          <button className="action-btn reject-btn" onClick={() => handleStatusUpdate('appointment', apt._id, 'cancelled')}>Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'adoptions' && (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Pet</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.adoptions.map(app => (
                  <tr key={app._id}>
                    <td>{app.userId?.fullName}</td>
                    <td>{app.petId?.name}</td>
                    <td>{app.email}</td>
                    <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                    <td>
                      <button className="action-btn edit-btn" onClick={() => viewApplication(app)}>View</button>
                      {app.status === 'pending' && (
                        <>
                          <button className="action-btn approve-btn" onClick={() => handleStatusUpdate('adoption', app._id, 'approved')}>Approve</button>
                          <button className="action-btn reject-btn" onClick={() => handleStatusUpdate('adoption', app._id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
