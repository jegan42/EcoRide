// frontend/src/router/AppRouter.tsx
import type { JSX } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/Dashboard';
import SigninPage from '../pages/SigninPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'signin', element: <SigninPage /> },
    ],
  },
]);

const AppRouter = (): JSX.Element => <RouterProvider router={router} />;

export default AppRouter;
