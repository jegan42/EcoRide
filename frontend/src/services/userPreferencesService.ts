// frontend/src/services/userPreferencesService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { ApiResponse } from '../types/api';
import type { UserPreferences } from '../types/preferences';
import {
  handleApiResponseBasic,
  handleApiResponseSafe,
} from '../utils/handleApiResponse';

const createUserPreferences = async (
  prefsData: Partial<UserPreferences>
): Promise<ApiResponse<UserPreferences>> => {
  const response = await api.post(`${API_URL}/preferences`, prefsData, {
    withCredentials: true,
  });
  return handleApiResponseSafe<UserPreferences>(response.data);
};

const fetchUserPreferences = async (): Promise<
  ApiResponse<UserPreferences>
> => {
  const response = await api.get(`${API_URL}/preferences/me`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<UserPreferences>(response.data);
};

const fetchUserPreferencesById = async (
  userId: string
): Promise<ApiResponse<UserPreferences>> => {
  const response = await api.get(`${API_URL}/preferences/${userId}`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<UserPreferences>(response.data);
};

const updateUserPreferences = async (
  prefsData: Partial<UserPreferences>
): Promise<ApiResponse<UserPreferences>> => {
  const response = await api.put(`${API_URL}/preferences`, prefsData, {
    withCredentials: true,
  });
  return handleApiResponseSafe<UserPreferences>(response.data);
};

const deleteUserPreferences = async (): Promise<ApiResponse<void>> => {
  const response = await api.delete(`${API_URL}/preferences`, {
    withCredentials: true,
  });
  return handleApiResponseBasic<void>(response.data);
};

export default {
  fetchUserPreferences,
  updateUserPreferences,
  createUserPreferences,
  fetchUserPreferencesById,
  deleteUserPreferences,
};
