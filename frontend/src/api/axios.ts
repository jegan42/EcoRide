// frontend/src/api/axios.ts
import axios from 'axios';
import { API_URL } from '../constants/api';
import { store } from '../store';
import { enqueueSnackbarError } from '../utils/enqueueSnackbar';

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
      error?.response?.data?.message ?? 'Erreur serveur inconnue.';
    enqueueSnackbarError(new Error(message));

    return Promise.reject(
      new Error(error?.message ?? 'Unknown error occurred.')
    );
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
