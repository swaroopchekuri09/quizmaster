// src/components/AdminRoute.js
// Redirects non-admin users away from admin pages

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
