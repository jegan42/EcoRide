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

  it('createUserPreferences appelle api.post avec les données', async () => {
    const prefsData: Partial<UserPreferences> = { acceptsSmoker: true };
    const mockResponse = { id: 'p1', ...prefsData };
    (api.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result =
      await userPreferencesService.createUserPreferences(prefsData);

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/preferences$/),
      prefsData,
      { withCredentials: true }
    );
    expect(result).toEqual(mockResponse);
  });

  it('fetchUserPreferences appelle api.get sur /preferences/me', async () => {
    const mockResponse = { id: 'p2', acceptsSmoker: true };
    (api.get as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await userPreferencesService.fetchUserPreferences();

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/preferences\/me$/),
      { withCredentials: true }
    );
    expect(result).toEqual(mockResponse);
  });

  it('fetchUserPreferencesById appelle api.get avec userId', async () => {
    const userId = 'u1';
    const mockResponse = { id: 'p3', acceptsSmoker: true };
    (api.get as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result =
      await userPreferencesService.fetchUserPreferencesById(userId);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/preferences/${userId}$`)),
      { withCredentials: true }
    );
    expect(result).toEqual(mockResponse);
  });

  it('updateUserPreferences appelle api.put avec userId et données', async () => {
    const userId = 'u2';
    const prefsData = { acceptsSmoker: true };
    const mockResponse = { id: 'p4', ...prefsData };
    (api.put as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await userPreferencesService.updateUserPreferences(
      userId,
      prefsData
    );

    expect(api.put).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/preferences/${userId}$`)),
      prefsData,
      { withCredentials: true }
    );
    expect(result).toEqual(mockResponse);
  });

  it('deleteUserPreferences appelle api.delete avec userId', async () => {
    const userId = 'u3';
    (api.delete as jest.Mock).mockResolvedValue({});

    await userPreferencesService.deleteUserPreferences(userId);

    expect(api.delete).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/preferences/${userId}$`)),
      { withCredentials: true }
    );
  });
});
