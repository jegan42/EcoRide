// frontend/src/services/userPreferencesService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { UserPreferences } from '../types/preferences';

const createUserPreferences = async (
  prefsData: Partial<UserPreferences>
): Promise<UserPreferences> => {
  const response = await api.post(`${API_URL}/preferences`, prefsData, {
    withCredentials: true,
  });
  return response.data;
};

const fetchUserPreferences = async (): Promise<UserPreferences> => {
  const response = await api.get(`${API_URL}/preferences/me`, {
    withCredentials: true,
  });
  return response.data;
};

const fetchUserPreferencesById = async (
  userId: string
): Promise<UserPreferences> => {
  const response = await api.get(`${API_URL}/preferences/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

const updateUserPreferences = async (
  userId: string,
  prefsData: Partial<UserPreferences>
): Promise<UserPreferences> => {
  const response = await api.put(
    `${API_URL}/preferences/${userId}`,
    prefsData,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const deleteUserPreferences = async (userId: string): Promise<void> => {
  await api.delete(`${API_URL}/preferences/${userId}`, {
    withCredentials: true,
  });
};

export default {
  fetchUserPreferences,
  updateUserPreferences,
  createUserPreferences,
  fetchUserPreferencesById,
  deleteUserPreferences,
};
