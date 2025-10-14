import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const adminAuthed = typeof window !== 'undefined' && localStorage.getItem('adminAuthed') === 'true';
  if (!adminAuthed) return <Navigate to="/admin/login" replace />;
  return children;
};

export default AdminProtectedRoute;
