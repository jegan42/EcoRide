// frontend/src/api/axios.ts
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de réponse (à compléter si tu veux gérer les erreurs globalement)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Exemple : afficher une toast si erreur globale
    console.error('API error:', error.response?.data || error.message);
    toast.error(error?.response?.data?.message || 'Erreur inconnue');

    return Promise.reject(error);
  }
);

export default api;
