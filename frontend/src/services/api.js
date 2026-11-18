import axios from 'axios';

const API = axios.create({
    baseURL: 'http://job-portal-backend-delta-tan.vercel.app/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('opportunityhub-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;