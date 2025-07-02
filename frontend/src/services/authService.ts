// frontend/src/services/authService.ts
import type { User } from '../types/user';
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { ApiResponse } from '../types/api';
import {
  handleApiResponseBasic,
  handleApiResponseSafe,
} from '../utils/handleApiResponse';
import { cleanPayload } from '../utils/cleanPayload';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const signup = async (payload: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await api.post(
    `${API_URL}/auth/signup`,
    cleanPayload(payload),
    {
      withCredentials: true,
    }
  );
  return handleApiResponseSafe<User>(response.data);
};

const signin = async (
  payload: Partial<User>,
  csrfToken: string
): Promise<ApiResponse<User>> => {
  const response = await api.post(`${API_URL}/auth/signin`, payload, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
  });

  return handleApiResponseSafe<User>(response.data);
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

const logoutFirebase = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('[Firebase] Déconnecté avec succès');
  } catch (error) {
    console.error('[Firebase] Erreur lors de la déconnexion :', error);
  }
};

export default {
  signup,
  signin,
  signout,
  logoutFirebase,
};
