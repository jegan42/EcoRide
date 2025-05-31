// frontend/src/utils/handleApiError.ts
import axios from 'axios';

export const extractApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === 'object') {
      if (typeof data.message === 'string') {
        return data.message;
      }
      if (typeof data.error === 'string') {
        return data.error;
      }
    }

    return error.message || 'Erreur réseau';
  }

  if (error instanceof Error) return error.message;

  return 'Une erreur inconnue est survenue';
};
