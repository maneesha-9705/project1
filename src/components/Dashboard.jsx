import React, { useEffect, useState } from 'react';

const Dashboard = ({ isLoggedIn, view }) => {
  const API = 'http://localhost:3000';
  const [events, setEvents] = useState([]);
  const [updates, setUpdates] = useState([]);

  const [query, setQuery] = useState('');

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      try {
        const [evRes, updRes] = await Promise.all([
          fetch(`${API}/events`),
          fetch(`${API}/updates`)
        ]);
        const [evData, updData] = await Promise.all([
          evRes.ok ? evRes.json() : [],
          updRes.ok ? updRes.json() : []
        ]);
        if (!canceled) {
          setEvents(Array.isArray(evData) ? evData : []);
          setUpdates(Array.isArray(updData) ? updData : []);
        }
      } catch (_) {
      }
    };
    const onChange = () => load();
    window.addEventListener('data-change', onChange);
    load();
    const id = setInterval(load, 15000);
    return () => { canceled = true; clearInterval(id); window.removeEventListener('data-change', onChange); };
  }, []);

  const matchesQuery = (text) =>
    String(text || '').toLowerCase().includes(query.trim().toLowerCase());

  const filteredEvents = events.filter(
    (e) => matchesQuery(e.title) || matchesQuery(e.description)
  );

  const filteredUpdates = updates.filter(
    (u) => matchesQuery(u.title) || matchesQuery(u.description)
  );

  const displayEvents = filteredEvents;
  const displayUpdates = filteredUpdates;

  const truncate = (text, max = 90) => (text.length > max ? text.slice(0, max) + '…' : text);

  const parseDay = (d) => {
    if (!d) return '';
    try {
      const dt = new Date(d);
      if (!isNaN(dt)) return String(dt.getDate()).padStart(2, '0');
    } catch {}
    return '';
  };
  const parseMonth = (d) => {
    if (!d) return '';
    try {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    } catch {}
    return '';
  };

  // Side-by-side layout: always show both sections

  return (
    <section className="dashboard-section">
      <div className="container">
        <div className="section-header">
          <h2>Events & Updates</h2>
          <p>Stay updated with latest events and announcements</p>
        </div>

        {isLoggedIn && (
          <div className="dashboard-controls">
            <div className="search-control">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search events and updates"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="dashboard-content">
          {!isLoggedIn && (
            <div className="auth-required">
              <i className="fas fa-user-lock"></i>
              <h3>Login Required</h3>
              <p>Please login to view events and updates.</p>
              <div className="auth-benefits">
                <h4>As a registered user, you get:</h4>
                <ul>
                  <li><i className="fas fa-check"></i> Access to exclusive events</li>
                  <li><i className="fas fa-check"></i> Real-time notifications</li>
                  <li><i className="fas fa-check"></i> Important announcements</li>
                  <li><i className="fas fa-check"></i> Stay connected with campus activities</li>
                </ul>
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="dashboard-content">
              <div className="events-section">
                <h3><i className="fas fa-calendar"></i> Upcoming Events</h3>
                <div className="events-list">
                  {displayEvents.map((event) => (
                    <div key={event.id} className="event-card">
                      <div className="event-date">
                        <span className="day">{event.date ? parseDay(event.date) : ''}</span>
                        <span className="month">{event.date ? parseMonth(event.date) : ''}</span>
                      </div>
                      <div className="event-info">
                        <h4>{event.title}</h4>
                        <p>{truncate(event.description || '')}</p>
                        <span className="event-time">
                          <i className="fas fa-clock"></i> {event.date || ''} {event.time || ''}
                        </span>
                      </div>
                    </div>
                  ))}
                  {displayEvents.length === 0 && (
                    <div className="no-notifications"><p>No events found.</p></div>
                  )}
                </div>
              </div>

              <div className="updates-section">
                <h3><i className="fas fa-bullhorn"></i> Latest Updates</h3>
                <div className="updates-list">
                  {displayUpdates.map((update) => (
                    <div key={update.id} className={`update-item ${update.type}`}>
                      <div className="update-icon">
                        <i className={`fas fa-${
                          update.type === 'info' ? 'info-circle' :
                          update.type === 'warning' ? 'exclamation-triangle' :
                          'star'
                        }`}></i>
                      </div>
                      <div className="update-content">
                        <h4>{update.title}</h4>
                        <p>{truncate(update.description || '')}</p>
                        <span className="update-time">{update.time}</span>
                      </div>
                    </div>
                  ))}
                  {displayUpdates.length === 0 && (
                    <div className="no-notifications"><p>No updates found.</p></div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
