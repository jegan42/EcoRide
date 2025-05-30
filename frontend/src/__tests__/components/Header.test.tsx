// frontend/src/__tests__/components/Header.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import theme from '../../styles/theme';
import { vi } from 'vitest';

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

const renderWithProviders = (
  ui: React.ReactElement
): ReturnType<typeof render> =>
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>{ui}</BrowserRouter>
    </ThemeProvider>
  );

describe('Header', () => {
  beforeEach(() => {
    (useMediaQuery as unknown as jest.Mock).mockReset();
  });

  it('affiche drawer et bouton déconnexion en mode mobile, ouvre et ferme drawer', async () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);

    renderWithProviders(<Header />);

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    expect(await screen.findByText('Accueil')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /déconnexion/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Accueil'));

    await waitFor(() => {
      expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
    });
  });
});

it('ferme le drawer quand on clique en dehors (onClose)', async () => {
  renderWithProviders(<Header />);

  const burgerButton = screen.getByRole('button');
  fireEvent.click(burgerButton);

  expect(await screen.findByText('Accueil')).toBeInTheDocument();

  const backdrop = document.querySelector('.MuiBackdrop-root') as HTMLElement;
  expect(backdrop).toBeTruthy();
  fireEvent.click(backdrop);

  await waitFor(() => {
    expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
  });
});
