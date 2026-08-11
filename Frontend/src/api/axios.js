import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:8000/api/v1'
  : 'https://helphive-backend-lvpy.onrender.com/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Interceptor: Har request ke sath Authorization header me token bhejega
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;