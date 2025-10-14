import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';
import '../styles/responsive.css';

const ResponsiveNavbar = ({
  isLoggedIn,
  currentUser,
  login,
  register,
  logout,
  notifications = [],
  showNotifications,
  setShowNotifications,
  markAllAsRead,
  markNotificationAsRead,
  unreadCount = 0
}) => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll for navbar style
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    setShowNotifications(false);
  };

  const NavLink = ({ to, children, className = '' }) => (
    <Link
      to={to}
      className={`px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors ${
        location.pathname === to ? 'text-blue-600' : ''
      } ${className}`}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, icon, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md ${
        location.pathname === to ? 'text-blue-600 bg-blue-50' : ''
      }`}
    >
      {icon && <i className={`fas fa-${icon} w-6 text-center mr-3`}></i>}
      {children}
    </Link>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <i className="fas fa-graduation-cap text-2xl text-blue-600"></i>
                <span className="text-xl font-bold text-gray-800">Student Hub</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/discussion">Discussion</NavLink>
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 rounded-full hover:bg-gray-100 relative"
                    >
                      <i className="fas fa-bell text-xl text-gray-600"></i>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="font-semibold text-gray-800">Notifications</h3>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAllAsRead();
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark all as read
                          </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div 
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                <p className="text-sm text-gray-700">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-gray-500">
                              <i className="far fa-bell-slash text-3xl mb-2"></i>
                              <p>No new notifications</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {currentUser?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden lg:inline-block text-sm font-medium text-gray-700">
                        {currentUser?.name || 'User'}
                      </span>
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-user-circle mr-2"></i> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-cog mr-2"></i> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex space-x-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <i className="fas fa-times text-2xl"></i>
                ) : (
                  <i className="fas fa-bars text-2xl"></i>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-2 space-y-1">
            <MobileNavLink to="/" icon="home">
              Home
            </MobileNavLink>
            <MobileNavLink to="/about" icon="info-circle">
              About Us
            </MobileNavLink>
            <MobileNavLink to="/events" icon="calendar-alt">
              Events & Updates
            </MobileNavLink>
            <MobileNavLink to="/discussion" icon="comments">
              Discussion
            </MobileNavLink>
            
            {isLoggedIn ? (
              <>
                <MobileNavLink to="/profile" icon="user-circle">
                  Profile
                </MobileNavLink>
                <MobileNavLink to="/settings" icon="cog">
                  Settings
                </MobileNavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-md"
                >
                  <i className="fas fa-sign-out-alt w-6 text-center mr-3"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <i className="fas fa-sign-in-alt w-6 text-center mr-3"></i>
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="w-full flex items-center px-4 py-3 text-left text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <i className="fas fa-user-plus w-6 text-center mr-3"></i>
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Add padding to account for fixed navbar */}
      <div className="h-16 md:h-20"></div>

      {/* Mobile Notifications */}
      {showNotifications && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" onClick={() => setShowNotifications(false)}>
          <div className="w-full bg-white rounded-t-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-sm text-blue-600"
                >
                  Mark all as read
                </button>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 ${!notification.read ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      markNotificationAsRead(notification.id);
                      setShowNotifications(false);
                    }}
                  >
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <i className="far fa-bell-slash text-3xl mb-2"></i>
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        show={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
        onLogin={login}
        onRegister={register}
      />
    </>
  );
};

export default ResponsiveNavbar;
