// frontend/src/api/axios.ts
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { API_URL } from '../constants/api';

const api = axios.create({
  baseURL: API_URL,
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
