// frontend/src/services/authService.ts
import type { User } from '../types/user';
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { ApiResponse } from '../types/api';
import {
  handleApiResponseBasic,
  handleApiResponseSafe,
} from '../utils/handleApiResponse';

const signup = async (
  payload: Partial<User>
): Promise<ApiResponse<Partial<User>>> => {
  const response = await api.post(`${API_URL}/auth/signup`, payload, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Partial<User>>(response.data);
};

const signin = async (
  payload: Partial<User>
): Promise<ApiResponse<Partial<User>>> => {
  const response = await api.post(`${API_URL}/auth/signin`, payload, {
    withCredentials: true,
  });

  return handleApiResponseSafe<Partial<User>>(response.data);
};

const signout = async (): Promise<ApiResponse<void>> => {
  const response = await api.post(
    `${API_URL}/auth/signout`,
    {},
    {
      withCredentials: true,
    }
  );
  return handleApiResponseBasic<void>(response.data);
};

export default {
  signup,
  signin,
  signout,
};
