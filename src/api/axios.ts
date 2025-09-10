import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api.tourpal.com/api', // Replace with your actual API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('tourpal_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;

