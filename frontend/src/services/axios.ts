import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.ecoride.com', // Change l'URL de l'API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
