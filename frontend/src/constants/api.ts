// frontend/src/constants/api.ts
export function getApiUrl(env = import.meta.env): string {
  return env.VITE_API_URL || 'http://localhost:4000/api';
}

export const API_URL = getApiUrl();
