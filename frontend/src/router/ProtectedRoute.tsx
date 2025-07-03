// frontend/src/router/ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import type { RootState } from '../store';
import type { JSX } from 'react';
import { hasRole } from '../utils/hasRole';
import Signin from '../pages/SigninPage';

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
    <Signin />
  );
};

export default ProtectedRoute;
