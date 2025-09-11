import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
    allowedRoles?: string[]; // New prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();

  if (auth?.loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles if allowedRoles are specified
  if (allowedRoles && auth?.user?.userType) {
    if (!allowedRoles.includes(auth.user.userType)) {
      // Redirect to an unauthorized page or login
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

