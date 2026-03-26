import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-libreria-itq-dfcuhgf8c2gzf9a0.brazilsouth-01.azurewebsites.net/api',
});

// Interceptor que añade el token si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;