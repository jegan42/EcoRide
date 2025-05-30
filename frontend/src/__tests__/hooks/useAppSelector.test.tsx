// frontend/src/__tests__/hooks/useAppSelector.test.tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import { useAppSelector } from '../../hooks/useAppSelector';
import type { JSX } from 'react';

const TestComponent = (): JSX.Element => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return <div>Auth: {isAuthenticated ? 'true' : 'false'}</div>;
};

describe('useAppSelector', () => {
  it('renvoie la valeur du state redux', () => {
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: true,
        },
      },
    });

    const { getByText } = render(
      <Provider store={testStore}>
        <TestComponent />
      </Provider>
    );

    expect(getByText('Auth: true')).toBeInTheDocument();
  });
});
