import React from 'react';
import { Redirect } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
