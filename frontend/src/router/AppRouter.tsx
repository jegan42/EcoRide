// frontend/src/router/AppRouter.tsx
import type { JSX } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/Dashboard';
import SigninPage from '../pages/SigninPage';
import ProtectedRoute from './ProtectedRoute';
import ProfilePage from '../pages/profile/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'signin', element: <SigninPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

const AppRouter = (): JSX.Element => <RouterProvider router={router} />;

export default AppRouter;
