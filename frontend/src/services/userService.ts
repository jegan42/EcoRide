// src/services/userService.ts
import axios from 'axios';
import type { User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

type UpdatePayload = Pick<
  User,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'username'
  | 'email'
  | 'password'
  | 'phone'
  | 'address'
  | 'avatar'
  | 'role'
  | 'credits'
>;

const updateUser = async (
  data: Partial<UpdatePayload>
): Promise<Partial<User>> => {
  const response = await axios.put(`${API_URL}/auth/update`, data, {
    withCredentials: true,
  });
  return response.data;
};

const fetchUser = async (): Promise<Partial<User>> => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    withCredentials: true,
  });
  return response.data;
};

export default {
  updateUser,
  fetchUser,
};
