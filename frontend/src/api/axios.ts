// frontend/src/api/axios.ts
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    const message =
      error?.response?.data?.message || 'Erreur serveur inconnue.';
    enqueueSnackbar(message, { variant: 'error' });

    return Promise.reject(error);
  }
);

export default api;
