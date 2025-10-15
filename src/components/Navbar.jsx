import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';

const Navbar = ({
  isLoggedIn,
  currentUser,
  login,
  logout,
  notifications,
  showNotifications,
  setShowNotifications,
  markAllAsRead,
  markNotificationAsRead,
  removeNotification,
  unreadCount
}) => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  // login-only modal
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNotificationClick = () => {
    if (isLoggedIn) {
      setShowNotifications(!showNotifications);
    }
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
    setIsMenuOpen(false);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    setShowNotifications(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setShowNotifications(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <i className="fas fa-graduation-cap"></i>
            <span>Student Hub</span>
          </div>

          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Events & Updates
              </Link>
            </li>
            <li>
              <Link
                to="/discussion"
                className={`nav-link ${location.pathname === '/discussion' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Discussion
              </Link>
            </li>
          </ul>

          <div className="nav-right">
            {isLoggedIn ? (
              <>
                {/* User Info */}
                <div className="user-info">
                  <span className="user-name">Welcome, {currentUser?.name}!</span>
                </div>

                {/* Notifications - Only for authenticated users */}
                <div className="notification-icon" onClick={handleNotificationClick}>
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </div>

                {/* Logout Button */}
                <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login/Register Buttons - Only for non-authenticated users */}
                <button
                  className="btn btn-primary"
                  onClick={handleAuthClick}
                >
                  Login
                </button>
                <Link
                  to="/register"
                  className="btn btn-secondary"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}

            <div
              className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              role="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Notifications Overlay - Only for authenticated users */}
      {isLoggedIn && showNotifications && (
        <div className="notification-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notification-header">
              <h4>Notifications</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {unreadCount > 0 && (
                  <span className="mark-all-read" onClick={markAllAsRead}>
                    Mark all as read
                  </span>
                )}
                <button className="close-btn" onClick={() => setShowNotifications(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <i className="fas fa-bell-slash"></i>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.type} ${notification.read ? 'read' : ''}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      <h5>{notification.title}</h5>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ marginLeft: '0.5rem' }}
                      title="Remove notification"
                      onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    {!notification.read && <div className="unread-dot"></div>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={login}
      />
    </>
  );
};

export default Navbar;
