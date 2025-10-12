import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <div className="footer-logo">
              <i className="fas fa-graduation-cap"></i>
              <span>Student Hub</span>
            </div>
            <p>Building stronger student communities through collaboration and engagement.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/events">Events & Updates</a></li>
              <li><a href="/discussion">Discussion</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p><i className="fas fa-envelope"></i> info@studenthub.com</p>
            <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Student Community Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
