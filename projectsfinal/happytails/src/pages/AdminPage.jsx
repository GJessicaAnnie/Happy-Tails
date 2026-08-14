import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; // We'll create this for minimal styling

const AdminPage = () => {
  const navigate = useNavigate();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch adoption requests on component mount
  useEffect(() => {
    fetchAdoptions();
  }, []);

  const fetchAdoptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/adoptions');
      if (!response.ok) {
        throw new Error('Failed to fetch adoptions');
      }
      const data = await response.json();
      setAdoptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/adoptions/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve adoption');
      }

      // Update the local state
      setAdoptions(adoptions.map(adoption =>
        adoption.id === id ? { ...adoption, status: 'approved' } : adoption
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/adoptions/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject adoption');
      }

      // Update the local state
      setAdoptions(adoptions.map(adoption =>
        adoption.id === id ? { ...adoption, status: 'rejected' } : adoption
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel - Adoption Requests</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="adoptions-list">
        {adoptions.length === 0 ? (
          <p>No adoption requests found.</p>
        ) : (
          adoptions.map((adoption) => (
            <div key={adoption.id} className="adoption-card">
              <div className="adoption-info">
                <h3>Pet: {adoption.petName}</h3>
                <p>User: {adoption.userName}</p>
                <p>Status: <span className={`status ${adoption.status}`}>{adoption.status}</span></p>
              </div>
              <div className="adoption-actions">
                {adoption.status === 'pending' && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(adoption.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(adoption.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;