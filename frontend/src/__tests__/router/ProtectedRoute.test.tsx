// frontend/src/__tests__/router/ProtectedRoute.test.tsx
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from '../../router/ProtectedRoute';

describe('ProtectedRoute', () => {
  const renderWithStore = (
    isAuthenticated: boolean
  ): ReturnType<typeof render> => {
    const store = configureStore({
      reducer: {
        auth: () => ({ isAuthenticated }),
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/signin" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('redirige vers /signin si non authentifié', () => {
    const { getByText } = renderWithStore(false);
    expect(getByText(/login page/i)).toBeInTheDocument();
  });

  it('rend les enfants si authentifié', () => {
    const { getByText } = renderWithStore(true);
    expect(getByText(/dashboard/i)).toBeInTheDocument();
  });
});
