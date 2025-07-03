// frontend/src/router/AdminRoute.tsx
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import type { RootState } from '../store';
import type { JSX } from 'react';
import { hasRole } from '../utils/hasRole';
import Signin from '../pages/SigninPage';

const AdminRoute = (): JSX.Element => {
  const { isAuthenticated, loading, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    return <div>Chargement...</div>;
  }

  const isAutorized = user
    ? hasRole(user, 'admin') || hasRole(user, 'employee')
    : false;

  return isAuthenticated && isAutorized ? (
    <Outlet />
  ) : (
    <Signin />
  );
};

export default AdminRoute;
