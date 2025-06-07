// frontend/src/__tests__/components/header/HeaderLogButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { HeaderLogButton } from '../../../components/header/HeaderLogButton';
import { vi } from 'vitest';
import { useAppSelector } from '../../../hooks/useAppSelector';

vi.mock('../../../hooks/useAppSelector', () => ({
  useAppSelector: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HeaderLogButton', () => {
  const logoutRef = { current: null };
  const loginRef = { current: null };

  it('displays "Logout" and calls onSignoutSubmit if logged in', () => {
    (useAppSelector as jest.Mock).mockReturnValue({ isAuthenticated: true });
    const mockSignout = vi.fn();

    render(
      <HeaderLogButton
        logoutButtonRef={logoutRef}
        loginButtonRef={loginRef}
        onSignoutSubmit={mockSignout}
      />
    );

    const button = screen.getByRole('button', { name: /déconnexion/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockSignout).toHaveBeenCalled();
  });

  it('displays "Login" and redirects to /signin if not logged in', () => {
    (useAppSelector as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(
      <HeaderLogButton
        logoutButtonRef={logoutRef}
        loginButtonRef={loginRef}
        onSignoutSubmit={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: /connexion/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });
});
