import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isLoggedIn }) => {
  const hasLocalRegistration = typeof window !== 'undefined' && localStorage.getItem('registered') === 'true';
  const allowed = isLoggedIn || hasLocalRegistration;
  if (!allowed) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

export default ProtectedRoute;
