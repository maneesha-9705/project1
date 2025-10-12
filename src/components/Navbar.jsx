import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';

const Navbar = ({
  isLoggedIn,
  currentUser,
  login,
  register,
  logout,
  notifications,
  showNotifications,
  setShowNotifications,
  markAllAsRead,
  markNotificationAsRead,
  unreadCount
}) => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleNotificationClick = () => {
    if (isLoggedIn) {
      setShowNotifications(!showNotifications);
    }
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowNotifications(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <i className="fas fa-graduation-cap"></i>
            <span>Student Hub</span>
          </div>

          <ul className="nav-menu">
            <li>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}
              >
                Events & Updates
              </Link>
            </li>
            <li>
              <Link
                to="/discussion"
                className={`nav-link ${location.pathname === '/discussion' ? 'active' : ''}`}
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
                  onClick={() => handleAuthClick('login')}
                >
                  Login
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleAuthClick('register')}
                >
                  Register
                </button>
              </>
            )}

            <div className="nav-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Notifications Dropdown - Only for authenticated users */}
      {isLoggedIn && showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <span className="mark-all-read" onClick={markAllAsRead}>
                Mark all as read
              </span>
            )}
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
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={login}
        onRegister={register}
        mode={authMode}
        setMode={setAuthMode}
      />
    </>
  );
};

export default Navbar;
