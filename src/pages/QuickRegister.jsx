import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const QuickRegister = ({ onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const reason = params.get('reason');
  const [form, setForm] = useState({ name: '', email: '', mobile: '', collegeId: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile)) newErrors.mobile = 'Enter 10-digit mobile number';
    if (!form.collegeId.trim()) newErrors.collegeId = 'College ID is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    if (form.password && form.password.length < 6) newErrors.password = 'At least 6 characters';
    if (!form.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm your password';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      // 1) Check if user already exists by email
      const existsRes = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(form.email)}`);
      if (!existsRes.ok) throw new Error('Lookup failed');
      const existing = await existsRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        setErrors({ api: 'This email is already registered.' });
        return;
      }

      // 2) Persist user to JSON server
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          collegeId: form.collegeId,
          password: form.password,
          createdAt: new Date().toISOString()
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save registration');
      }
    } catch (err) {
      setErrors({ api: 'Unable to save your registration. Please try again.' });
      return;
    }

    // Set flag so ProtectedRoute allows access immediately and notify app
    localStorage.setItem('registered', 'true');
    window.dispatchEvent(new Event('registered-change'));

    if (typeof onSuccess === 'function') {
      onSuccess();
      setTimeout(() => navigate('/'), 0);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="register-page">
      <section className="register-hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-copy">
              <h1><i className="fas fa-user-graduate"></i> Join Student Hub</h1>
              <p>Access events, updates, and discussions after a quick, one-time registration.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="register-section">
        <div className="container">
          <div className="register-card">
            <div className="register-left">
              {reason === 'not_found' && (
                <div className="error-text" style={{ background: '#fff3cd', border: '1px solid #ffeaa7', color: '#856404', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  We couldn't find an account with that email. Please register to continue.
                </div>
              )}
              <h2>Create your account</h2>
              <p className="muted">It only takes a minute. We’ll never share your details.</p>

              <form onSubmit={handleSubmit} className="register-form">
                {errors.api && <div className="error-text" style={{ marginBottom: '0.75rem' }}>{errors.api}</div>}
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.name && <small className="error-text">{errors.name}</small>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.email && <small className="error-text">{errors.email}</small>}
                  </div>
                  <div className="form-group">
                    <label>Mobile (10 digits)</label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="9876543210"
                      value={form.mobile}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.mobile && <small className="error-text">{errors.mobile}</small>}
                  </div>
                </div>

                <div className="form-group">
                  <label>College ID</label>
                  <input
                    type="text"
                    name="collegeId"
                    placeholder="e.g., CLG12345"
                    value={form.collegeId}
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.collegeId && <small className="error-text">{errors.collegeId}</small>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.password && <small className="error-text">{errors.password}</small>}
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.confirmPassword && <small className="error-text">{errors.confirmPassword}</small>}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary register-btn">
                  <i className="fas fa-arrow-right"></i> Continue
                </button>
              </form>
            </div>

            <div className="register-right">
              <div className="benefit">
                <i className="fas fa-calendar-check"></i>
                <div>
                  <h4>Stay on top of events</h4>
                  <p>Never miss campus happenings and opportunities.</p>
                </div>
              </div>
              <div className="benefit">
                <i className="fas fa-bullhorn"></i>
                <div>
                  <h4>Get latest updates</h4>
                  <p>Important notices, scholarships, and more.</p>
                </div>
              </div>
              <div className="benefit">
                <i className="fas fa-comments"></i>
                <div>
                  <h4>Join discussions</h4>
                  <p>Share ideas and connect with peers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickRegister;
