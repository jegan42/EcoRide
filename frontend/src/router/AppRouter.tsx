// frontend/src/router/AppRouter.tsx
import type { JSX } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signin from '../pages/SigninPage';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import { AppLayout } from '../layouts/AppLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'signin', element: <Signin /> },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'dashboard', element: <Dashboard /> },
        ],
      },
    ],
  },
]);

export const AppRouter = (): JSX.Element => <RouterProvider router={router} />;
