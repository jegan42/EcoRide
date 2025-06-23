// frontend/src/router/AppRouter.tsx
import type { JSX } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signin from '../pages/SigninPage';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import { AppLayout } from '../layouts/AppLayout';
import { FindTripPage } from '../pages/FindTripPage';
import { TripDetailsPage } from '../pages/TripDetailsPage';
import { Home } from '../pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'signin', element: <Signin /> },
      { path: 'findtrip', element: <FindTripPage /> },
      { path: 'tripdetails/:id', element: <TripDetailsPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'dashboard', element: <Dashboard /> }],
      },
    ],
  },
]);

export const AppRouter = (): JSX.Element => <RouterProvider router={router} />;
