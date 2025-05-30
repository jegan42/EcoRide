// frontend/src/services/userService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { User } from '../types/user';

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
  const response = await api.put(`${API_URL}/auth/update`, data, {
    withCredentials: true,
  });
  return response.data;
};

const fetchUser = async (): Promise<Partial<User>> => {
  const response = await api.get(`${API_URL}/auth/me`, {
    withCredentials: true,
  });
  return response.data;
};

export default {
  updateUser,
  fetchUser,
};
