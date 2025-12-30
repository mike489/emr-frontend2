import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactElement;
  permission?: string;
}

const ProtectedRoute = ({ children, permission }: ProtectedRouteProps) => {
  const { user, token, isTokenValid, hasPermission, isLoading } = useAuthStore();
  const location = useLocation();

  const isLoggedIn = !!user && !!token && isTokenValid();

  if (isLoading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/clinics" replace />;
  }

  return children;
};

export default ProtectedRoute;
