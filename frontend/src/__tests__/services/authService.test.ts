// frontend/src/__tests__/services/authService.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from '../../services/authService';
import api from '../../api/axios';

vi.mock('../../api/axios');

describe('authService', () => {
  const mockUser = { email: 'test@example.com', password: 'Password123!' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the correct endpoint for signup', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { id: 1, ...mockUser } });

    const res = await authService.signup(mockUser);
    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/signup$/),
      mockUser,
      { withCredentials: true }
    );
    expect(res).toEqual({ id: 1, ...mockUser });
  });

  it('calls the correct endpoint for signin', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { token: 'abc123' } });

    const res = await authService.signin(mockUser);
    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/signin$/),
      mockUser,
      { withCredentials: true }
    );
    expect(res).toEqual({ token: 'abc123' });
  });

  it('calls the correct endpoint for signout', async () => {
    (api.post as jest.Mock).mockResolvedValue({});

    await authService.signout();
    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/signout$/),
      {},
      { withCredentials: true }
    );
  });

  it('propagates errors if the call fails', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(authService.signin(mockUser)).rejects.toThrow('Network error');
  });
});
