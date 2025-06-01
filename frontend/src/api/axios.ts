// frontend/src/api/axios.ts
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { API_URL } from '../constants/api';
import { store } from '../store';

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
    const message =
      error?.response?.data?.message || 'Erreur serveur inconnue.';
    enqueueSnackbar(message, { variant: 'error' });

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const state = store.getState();
  const csrfToken = state.auth.csrfToken;
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  config.withCredentials = true;
  return config;
});
export default api;
