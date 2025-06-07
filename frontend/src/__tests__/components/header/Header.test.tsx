// frontend/src/__tests__/components/header/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { Header } from '../../../components/header/Header';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../../../styles/theme';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../components/Logo', () => ({
  Logo: () => <div data-testid="mock-logo">Mock Logo</div>,
}));

vi.mock('../../components/header/HeaderNav', () => ({
  HeaderNav: () => <div data-testid="mock-headernav">Mock HeaderNav</div>,
}));

describe('Header component', () => {
  const renderWithProviders = (): ReturnType<typeof render> =>
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

  it('render AppBar avec Logo et HeaderNav', () => {
    renderWithProviders();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
