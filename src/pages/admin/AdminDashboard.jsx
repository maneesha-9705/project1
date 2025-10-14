import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('adminAuthed');
    navigate('/admin/login');
  };

  return (
    <section className="about-section" style={{ paddingTop: '7rem' }}>
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Admin Dashboard</h2>
            <p className="muted">Manage platform announcements without affecting the user interface.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link className="btn btn-primary" to="/admin/notifications">Manage Notifications</Link>
              <Link className="btn btn-secondary" to="/admin/events">Manage Events</Link>
              <button className="btn btn-secondary" onClick={logout}>Logout</button>
            </div>
          </div>
          <div className="about-stats">
            <div className="stat-item">
              <h3>Notifications</h3>
              <p>Create and remove announcements.</p>
            </div>
            <div className="stat-item">
              <h3>Events</h3>
              <p>Post upcoming events for students.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
