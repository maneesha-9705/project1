import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <div className="protected-route">
        <div className="container">
          <div className="access-denied">
            <i className="fas fa-lock"></i>
            <h2>Access Restricted</h2>
            <p>You need to be registered and logged in to access this page.</p>
            <div className="access-benefits">
              <h3>As a registered user, you get:</h3>
              <ul>
                <li><i className="fas fa-check"></i> Access to events and updates</li>
                <li><i className="fas fa-check"></i> Participate in discussions</li>
                <li><i className="fas fa-check"></i> Receive notifications</li>
                <li><i className="fas fa-check"></i> Connect with other students</li>
              </ul>
            </div>
            <p>Please register or login to continue.</p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
