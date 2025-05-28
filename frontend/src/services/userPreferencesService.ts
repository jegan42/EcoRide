// src/services/userPreferencesService.ts
import axios from 'axios';
import type { UserPreferences } from '../types/preferences';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const createUserPreferences = async (
  prefsData: Partial<UserPreferences>
): Promise<UserPreferences> => {
  const response = await axios.post(`${API_URL}/preferences`, prefsData, {
    withCredentials: true,
  });
  return response.data;
};

const fetchUserPreferences = async (): Promise<UserPreferences> => {
  const response = await axios.get(`${API_URL}/preferences/me`, {
    withCredentials: true,
  });
  return response.data;
};

const fetchUserPreferencesById = async (
  userId: string
): Promise<UserPreferences> => {
  const response = await axios.get(`${API_URL}/preferences/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

const updateUserPreferences = async (
  userId: string,
  prefsData: Partial<UserPreferences>
): Promise<UserPreferences> => {
  const response = await axios.put(
    `${API_URL}/preferences/${userId}`,
    prefsData,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const deleteUserPreferences = async (userId: string): Promise<void> => {
  await axios.delete(`${API_URL}/preferences/${userId}`, {
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
