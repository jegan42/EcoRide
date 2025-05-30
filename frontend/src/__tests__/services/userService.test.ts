// frontend/src/__tests__/services/userService.test.tsx
import userService from '../../services/userService';
import api from '../../api/axios';
import { vi } from 'vitest';

vi.mock('../../api/axios');

describe('userService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetchUser devrait appeler api.get avec le bon endpoint', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    (api.get as jest.Mock).mockResolvedValue({ data: mockUser });

    const result = await userService.fetchUser();

    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/auth\/me/), {
      withCredentials: true,
    });
    expect(result).toEqual(mockUser);
  });

  it('updateUser devrait appeler api.put avec les bons paramètres', async () => {
    const payload = { id: '123', firstName: 'John' };
    const mockResponse = { ...payload, email: 'john@example.com' };

    (api.put as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await userService.updateUser(payload);

    expect(api.put).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/update/),
      payload,
      { withCredentials: true }
    );
    expect(result).toEqual(mockResponse);
  });
});
