import React from 'react';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Student Community Hub</h1>
          <p>Your one-stop platform for academic collaboration, events, and discussions</p>
          <div className="hero-buttons">
            <a href="/events" className="btn btn-primary">Explore Events & Updates</a>
            <a href="/discussion" className="btn btn-secondary">Join Discussion</a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <h3>500+</h3>
            <p>Active Students</p>
          </div>
          <div className="stat">
            <h3>50+</h3>
            <p>Events This Month</p>
          </div>
          <div className="stat">
            <h3>200+</h3>
            <p>Discussion Topics</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Student Hub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-calendar-alt feature-icon"></i>
              <h3>Event Management</h3>
              <p>Stay updated with campus events, workshops, and academic activities</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-users feature-icon"></i>
              <h3>Community Building</h3>
              <p>Connect with fellow students and build lasting friendships</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-comments feature-icon"></i>
              <h3>Discussion Forums</h3>
              <p>Share ideas, ask questions, and collaborate on projects</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-bell feature-icon"></i>
              <h3>Real-time Notifications</h3>
              <p>Get instant updates about important announcements and events</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
