import React from 'react';

const About = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>About Student Community Hub</h2>
            <p>
              Student Community Hub is a dedicated platform designed to foster collaboration,
              communication, and engagement among students. Our mission is to create a vibrant
              community where students can connect, share ideas, and support each other's
              academic journey.
            </p>

            <div className="about-features">
              <h3>Our Mission</h3>
              <p>
                To provide students with a comprehensive platform that enhances their academic
                experience through better communication, event management, and community building.
              </p>

              <h3>What We Offer</h3>
              <ul>
                <li>
                  <i className="fas fa-check"></i>
                  Real-time event notifications and updates
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Interactive discussion forums
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Community building tools
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Academic resource sharing
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Networking opportunities
                </li>
              </ul>
            </div>
          </div>

          <div className="about-stats">
            <div className="stat-item">
              <h3>5+ Years</h3>
              <p>Serving the student community</p>
            </div>
            <div className="stat-item">
              <h3>1000+ Students</h3>
              <p>Active community members</p>
            </div>
            <div className="stat-item">
              <h3>24/7 Support</h3>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
