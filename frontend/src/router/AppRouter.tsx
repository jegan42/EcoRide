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
import { LegalNotice } from '../pages/LegalNotice';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import AdminRoute from './AdminRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'signin', element: <Signin /> },
      { path: 'findtrip', element: <FindTripPage /> },
      { path: 'tripdetails/:id', element: <TripDetailsPage /> },
      { path: 'notices', element: <LegalNotice /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'dashboard', element: <Dashboard /> }],
      },
      {
        element: <AdminRoute />,
        children: [{ path: 'admin', element: <AdminDashboard /> }],
      },
    ],
  },
]);

export const AppRouter = (): JSX.Element => <RouterProvider router={router} />;
