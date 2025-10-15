import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = (formData.email || '').trim();
    const password = (formData.password || '').trim();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Check if user exists in JSON server by email
    try {
      const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Lookup failed');
      const users = await res.json();

      if (Array.isArray(users) && users.length > 0) {
        const user = users[0];
        // If password is stored, require matching; otherwise allow for legacy users
        if (user.password && user.password !== password) {
          setError('Incorrect password');
          return;
        }
        localStorage.setItem('registered', 'true');
        window.dispatchEvent(new Event('registered-change'));
        if (typeof onLogin === 'function') onLogin(email, password);
        onClose();
        setFormData({ email: '', password: '' });
        // redirect to home after login success
        try { window.location.assign('/'); } catch {}
      } else {
        // redirect to register if not found
        onClose();
        window.location.assign('/register?reason=not_found');
      }
    } catch (_) {
      setError('Unable to verify your account. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h3>Login</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary auth-btn">
            Login
          </button>
        </form>

        <div className="auth-modal-footer">
          <p>
            <a href="/admin/login" className="link-btn">Admin Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
