import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const API = 'http://localhost:3000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Simple hardcoded auth to avoid affecting user side
    const username = (form.username || '').trim().toLowerCase();
    const password = (form.password || '').trim();
    if (username === 'admin' && password === 'admin123') {
      try {
        const adminPayload = {
          username: username,
          loggedInAt: new Date().toISOString()
        };
        await fetch(`${API}/admins`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminPayload)
        });
      } catch (_) {
        // ignore persist errors for now to not block login UX
      }
      localStorage.setItem('adminAuthed', 'true');
      navigate('/admin/notifications');
      // Fallback in case SPA navigation is blocked by router state
      setTimeout(() => { if (window.location.pathname !== '/admin/notifications') window.location.assign('/admin/notifications'); }, 0);
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <section className="about-section" style={{ paddingTop: '7rem' }}>
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="about-text">
          <h2>Admin Login</h2>
          <p className="muted">Use admin credentials to manage notifications and events.</p>
          {error && <div className="error-text" style={{ marginBottom: '0.75rem' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input className="form-control" type="text" name="username" value={form.username} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} />
            </div>
            <button className="btn btn-primary" type="submit">Login</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
