// frontend/src/__tests__/hooks/useProfile.test.tsx
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useProfile } from '../../hooks/useProfile';
import * as userService from '../../services/userService';
import * as snackbar from '../../utils/enqueueSnackbar';
import * as redux from 'react-redux';
import { useAppSelector } from '../../hooks/useAppSelector';
import { vi } from 'vitest';

vi.mock('../../hooks/useAppSelector');
vi.mock('../../services/userService');
vi.mock('../../utils/enqueueSnackbar');
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

const mockUser = {
  id: 'user1',
  email: 'test@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  role: ['driver'],
};

describe('useProfile', () => {
  const dispatchMock = vi.fn();
  const selectorMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (redux.useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    (useAppSelector as jest.Mock).mockImplementation(selectorMock);
    selectorMock.mockReturnValue({ user: mockUser });
  });

  it('returns initial user and isDriver true if user has driver role', () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isDriver).toBe(true);
  });

  it('shows error if user.id is missing', async () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      user: { ...mockUser, id: undefined },
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      const success = await result.current.onUpdateUser({
        firstName: 'New',
      } as { firstName: string });
      expect(success).toBe(false);
    });

    expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith(
      "L'utilisateur est invalide."
    );
  });

  it('successfully updates user', async () => {
    const updatedUser = { ...mockUser, firstName: 'Updated' };

    (userService.updateUser as jest.Mock).mockResolvedValue({
      message: 'Profil mis à jour',
      data: updatedUser,
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      const success = await result.current.onUpdateUser({
        firstName: 'Updated',
      } as { firstName: string });
      expect(success).toBe(true);
    });

    expect(userService.updateUser).toHaveBeenCalledWith({
      firstName: 'Updated',
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'auth/signin',
      payload: { user: updatedUser, isAuthenticated: true },
    });
    expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
      'Profil mis à jour'
    );
    expect(result.current.user).toEqual(updatedUser);
  });

  it('handles error during update', async () => {
    (userService.updateUser as jest.Mock).mockRejectedValue('Erreur réseau');

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      const success = await result.current.onUpdateUser({
        firstName: 'Error',
      } as { firstName: string });
      expect(success).toBe(false);
    });

    expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith('Erreur réseau');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('returns isDriver false if user is null', () => {
    (useAppSelector as jest.Mock).mockReturnValue({ user: null });

    const { result } = renderHook(() => useProfile());

    expect(result.current.user).toBeNull();
    expect(result.current.isDriver).toBe(false);
  });
});
