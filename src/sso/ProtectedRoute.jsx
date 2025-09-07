import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserFromToken } from '../utils/api';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated with valid token
  if (!isAuthenticated()) {
  return <Navigate to="/admin/access-denied" replace />;
  }
  
  // Get user data from token
  const user = getUserFromToken();
  if (!user || user.role !== 'admin') {
  return <Navigate to="/admin/access-denied" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
