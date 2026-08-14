import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === 'admin@gmail.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
      return;
    }

    alert('Invalid credentials');
  };

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 24, border: '1px solid #ddd', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
            style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #ccc' }}
            required
          />
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
            style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #ccc' }}
            required
          />
        </label>

        <button
          type="submit"
          style={{ width: '100%', padding: 12, borderRadius: 6, border: 'none', background: '#2f80ed', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
