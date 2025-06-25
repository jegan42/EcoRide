// frontend/src/router/ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../store';
import type { JSX } from 'react';
import { hasRole } from '../utils/hasRole';

const ProtectedRoute = (): JSX.Element => {
  const { isAuthenticated, loading, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    return <div>Chargement...</div>;
  }

  const isAuthorized = user ? !hasRole(user, 'suspended') : true;

  return isAuthenticated && isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default ProtectedRoute;
