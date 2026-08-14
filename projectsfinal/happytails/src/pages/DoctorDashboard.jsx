import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorService } from '../services/doctorService';
import './DoctorDashboard.css';

function DoctorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const profileRes = await doctorService.getProfile();
      setProfile(profileRes.data.doctor);
      
      const params = selectedDate ? { date: selectedDate } : {};
      const apptRes = await doctorService.getAppointments(params);
      setAppointments(apptRes.data.appointments);
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

  const toggleAvailability = async () => {
    try {
      await doctorService.updateAvailability({ isAvailable: !profile.isAvailable });
      fetchData();
    } catch (error) {
      alert('Error updating availability');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await doctorService.updateAppointmentStatus(id, { status });
      fetchData();
    } catch (error) {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard - {user?.fullName}</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="profile-section">
        <div className="profile-header">
          <div>
            <h2>{profile?.fullName}</h2>
            <p>Specialization: {profile?.specialization}</p>
            <p>Experience: {profile?.experience}</p>
            <p>Rating: {profile?.rating} ⭐</p>
          </div>
          <div className="availability-toggle">
            <span>{profile?.isAvailable ? 'Available' : 'Unavailable'}</span>
            <div className={`toggle-switch ${profile?.isAvailable ? 'active' : ''}`} onClick={toggleAvailability}></div>
          </div>
        </div>
      </div>

      <div className="data-table">
        <div style={{ marginBottom: '20px' }}>
          <label>Filter by Date: </label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        <h3>My Appointments ({appointments.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Pet</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt._id}>
                <td>{apt.userId?.fullName}</td>
                <td>{apt.petName} ({apt.petType})</td>
                <td>{new Date(apt.date).toLocaleDateString()}</td>
                <td>{apt.timeSlot}</td>
                <td>{apt.reason}</td>
                <td><span className={`status-badge status-${apt.status}`}>{apt.status}</span></td>
                <td>
                  {apt.status === 'pending' && (
                    <>
                      <button className="action-btn approve-btn" onClick={() => updateStatus(apt._id, 'confirmed')}>Confirm</button>
                      <button className="action-btn reject-btn" onClick={() => updateStatus(apt._id, 'cancelled')}>Cancel</button>
                    </>
                  )}
                  {apt.status === 'confirmed' && (
                    <button className="action-btn approve-btn" onClick={() => updateStatus(apt._id, 'completed')}>Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && <p>No appointments found.</p>}
      </div>
    </div>
  );
}

export default DoctorDashboard;
