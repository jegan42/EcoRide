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
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getUser successful',
        data: mockUser,
      },
    });

    const result = await userService.fetchUser();

    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/auth\/me/), {
      withCredentials: true,
    });
    expect(result.message).toBe('getUser successful');
    expect(result.data).toEqual(mockUser);
  });

  it('updateUser should call api.put with the correct parameters', async () => {
    const payload = { id: '123', firstName: 'John' };
    const mockResponse = { ...payload, email: 'john@example.com' };

    (api.put as jest.Mock).mockResolvedValue({
      data: {
        message: 'updateUser successful',
        data: mockResponse,
      },
    });

    const result = await userService.updateUser(payload);

    expect(api.put).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/update/),
      payload,
      { withCredentials: true }
    );
    expect(result.message).toBe('updateUser successful');
    expect(result.data).toEqual(mockResponse);
  });
});
