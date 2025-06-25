// frontend/src/services/userService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { ApiResponse } from '../types/api';
import type { User } from '../types/user';
import { cleanPayload } from '../utils/cleanPayload';
import { handleApiResponseSafe } from '../utils/handleApiResponse';

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

export const updateUser = async (
  data: Partial<UpdatePayload>
): Promise<ApiResponse<User>> => {
  const response = await api.put(`${API_URL}/auth/update`, cleanPayload(data), {
    withCredentials: true,
  });
  return handleApiResponseSafe<User>(response.data);
};

export const fetchAllUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await api.get(`${API_URL}/auth/all`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<User[]>(response.data);
};

export const fetchUser = async (): Promise<ApiResponse<User>> => {
  const response = await api.get(`${API_URL}/auth/me`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<User>(response.data);
};

export const fetchUserById = async (id: string): Promise<ApiResponse<User>> => {
  const response = await api.get(`${API_URL}/auth/${id}`);
  return handleApiResponseSafe<User>(response.data);
};

export default {
  updateUser,
  fetchUser,
  fetchUserById,
  fetchAllUsers,
};
