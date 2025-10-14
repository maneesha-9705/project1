import React, { useState } from 'react';

const Dashboard = ({ isLoggedIn, view }) => {
  const events = [
    {
      id: 1,
      title: "Career Fair 2024",
      description: "Meet with top companies and explore job opportunities",
      date: "15",
      month: "OCT",
      time: "10:00 AM - 4:00 PM"
    },
    {
      id: 2,
      title: "Tech Workshop",
      description: "Learn about the latest technologies in web development",
      date: "20",
      month: "OCT",
      time: "2:00 PM - 5:00 PM"
    },
    {
      id: 3,
      title: "Study Group Session",
      description: "Mathematics preparation for upcoming exams",
      date: "25",
      month: "OCT",
      time: "6:00 PM - 8:00 PM"
    }
  ];

  const updates = [
    {
      id: 1,
      title: "Library Hours Extended",
      description: "The main library will now be open until 11 PM during exam season.",
      time: "2 hours ago",
      type: "info"
    },
    {
      id: 2,
      title: "Campus Maintenance Notice",
      description: "Building A will be under maintenance this weekend. Please use alternative routes.",
      time: "4 hours ago",
      type: "warning"
    },
    {
      id: 3,
      title: "New Scholarship Available",
      description: "Applications are now open for the Excellence in STEM Scholarship 2024.",
      time: "1 day ago",
      type: "success"
    }
  ];

  const [activeTab, setActiveTab] = useState('events');
  const [query, setQuery] = useState('');

  const matchesQuery = (text) =>
    text.toLowerCase().includes(query.trim().toLowerCase());

  const filteredEvents = events.filter(
    (e) => matchesQuery(e.title) || matchesQuery(e.description)
  );

  const filteredUpdates = updates.filter(
    (u) => matchesQuery(u.title) || matchesQuery(u.description)
  );

  const half = (n) => Math.ceil(n / 2);
  const displayEvents = filteredEvents.slice(0, half(filteredEvents.length));
  const displayUpdates = filteredUpdates.slice(0, half(filteredUpdates.length));

  const truncate = (text, max = 90) => (text.length > max ? text.slice(0, max) + '…' : text);

  // Side-by-side layout: always show both sections

  return (
    <section className="dashboard-section">
      <div className="container">
        <div className="section-header">
          <h2>Events & Updates</h2>
          <p>Stay updated with latest events and announcements</p>
        </div>

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
                        <span className="day">{event.date}</span>
                        <span className="month">{event.month}</span>
                      </div>
                      <div className="event-info">
                        <h4>{event.title}</h4>
                        <p>{truncate(event.description)}</p>
                        <span className="event-time">
                          <i className="fas fa-clock"></i> {event.time}
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
                        <p>{truncate(update.description)}</p>
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
