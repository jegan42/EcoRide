// src/services/authService.ts
import axios from 'axios';
import type { User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const signup = async (payload: Partial<User>): Promise<Partial<User>> => {
  const response = await axios.post(`${API_URL}/auth/signup`, payload, {
    withCredentials: true,
  });
  return response.data;
};

const signin = async (payload: Partial<User>): Promise<Partial<User>> => {
  const response = await axios.post(`${API_URL}/auth/signin`, payload, {
    withCredentials: true,
  });
  return response.data;
};

const signout = async (): Promise<void> => {
  await axios.post(
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
