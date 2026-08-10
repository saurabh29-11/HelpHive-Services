import axios from 'axios';

const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  'https://helphive-backend-lvpy.onrender.com/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Crucial for cookies/session
});

export default api;