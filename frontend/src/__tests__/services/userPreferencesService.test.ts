// frontend/src/__tests__/services/userPreferencesService.test.tsx
import userPreferencesService from '../../services/userPreferencesService';
import api from '../../api/axios';
import { vi } from 'vitest';
import type { UserPreferences } from '../../types/preferences';

vi.mock('../../api/axios');

describe('userPreferencesService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('createUserPreferences calls api.post with the data', async () => {
    const prefsData: Partial<UserPreferences> = { acceptsSmoker: true };
    const mockResponse = { id: 'p1', ...prefsData };
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        message: 'createPreferences successful',
        data: mockResponse,
      },
    });

    const result =
      await userPreferencesService.createUserPreferences(prefsData);

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/preferences$/),
      prefsData,
      { withCredentials: true }
    );
    expect(result.message).toBe('createPreferences successful');
    expect(result.data).toEqual(mockResponse);
  });

  it('fetchUserPreferences calls api.get on /preferences/me', async () => {
    const mockResponse = { id: 'p2', acceptsSmoker: true };
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getPreferences successful',
        data: mockResponse,
      },
    });

    const result = await userPreferencesService.fetchUserPreferences();

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/preferences\/me$/),
      { withCredentials: true }
    );
    expect(result.message).toBe('getPreferences successful');
    expect(result.data).toEqual(mockResponse);
  });

  it('fetchUserPreferencesById calls api.get with userId', async () => {
    const userId = 'u1';
    const mockResponse = { id: 'p3', acceptsSmoker: true };
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getPreferencesById successful',
        data: mockResponse,
      },
    });

    const result =
      await userPreferencesService.fetchUserPreferencesById(userId);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/preferences/${userId}$`))
    );
    expect(result.message).toBe('getPreferencesById successful');
    expect(result.data).toEqual(mockResponse);
  });

  it('updateUserPreferences calls api.put with userId and data', async () => {
    const prefsData = { acceptsSmoker: true };
    const mockResponse = { id: 'p4', ...prefsData };
    (api.put as jest.Mock).mockResolvedValue({
      data: {
        message: 'updatePreferences successful',
        data: mockResponse,
      },
    });

    const result =
      await userPreferencesService.updateUserPreferences(prefsData);

    expect(api.put).toHaveBeenCalledWith(
      expect.stringMatching(/\/preferences/),
      prefsData,
      { withCredentials: true }
    );
    expect(result.message).toBe('updatePreferences successful');
    expect(result.data).toEqual(mockResponse);
  });

  it('deleteUserPreferences calls api.delete with userId', async () => {
    (api.delete as jest.Mock).mockResolvedValue({
      data: {
        message: 'deletePreferences successful',
      },
    });

    const result = await userPreferencesService.deleteUserPreferences();

    expect(api.delete).toHaveBeenCalledWith(
      expect.stringMatching(/\/preferences/),
      { withCredentials: true }
    );
    expect(result.message).toBe('deletePreferences successful');
  });
});
