// frontend/src/utils/handleApiResponse.ts
import type { ApiResponse } from '../types/api';

export const handleApiResponseSafe = <T>(response: unknown): ApiResponse<T> => {
  const res = response as ApiResponse<T>;
  if (!res || typeof res !== 'object')
    throw new Error('Réponse invalide du serveur');
  if (!res.data) throw new Error('Aucune donnée reçue du serveur');
  return res;
};

export const handleApiResponseBasic = <T = undefined>(
  response: unknown
): ApiResponse<T> => {
  const res = response as Partial<ApiResponse<T>>;
  if (!res || typeof res !== 'object' || !res.message) {
    throw new Error('Réponse invalide ou message manquant');
  }
  return {
    message: res.message,
    data: res.data as T,
  };
};
