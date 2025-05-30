// frontend/src/services/authService.ts
import type { User } from '../types/user';
import api from '../api/axios';
import { API_URL } from '../constants/api';

const signup = async (payload: Partial<User>): Promise<Partial<User>> => {
  const response = await api.post(`${API_URL}/auth/signup`, payload, {
    withCredentials: true,
  });
  return response.data;
};

const signin = async (payload: Partial<User>): Promise<Partial<User>> => {
  const response = await api.post(`${API_URL}/auth/signin`, payload, {
    withCredentials: true,
  });
  return response.data;
};

const signout = async (): Promise<void> => {
  await api.post(
    `${API_URL}/auth/signout`,
    {},
    {
      withCredentials: true,
    }
  );
};

export default {
  signup,
  signin,
  signout,
};
