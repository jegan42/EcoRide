// frontend/src/services/csrfService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { ApiResponse } from '../types/api';
import { handleApiResponseSafe } from '../utils/handleApiResponse';

export const getCsrfToken = async (): Promise<ApiResponse<string>> => {
  const response = await api.get(`${API_URL}/csrf-token`);

  return handleApiResponseSafe<string>(response.data);
};
