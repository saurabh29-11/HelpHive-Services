import axios from 'axios';

// Ensure exact protocol without leading slashes or brackets
const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:8000/api/v1'
  : 'https://helphive-backend-lvpy.onrender.com/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export default api;