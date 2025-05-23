import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

const RequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when navigating to a new page
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected outlet
  return <Outlet />;
};

export default RequireAuth;