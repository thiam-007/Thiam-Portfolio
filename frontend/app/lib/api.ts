import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API Functions
export const apiClient = {
    // Profile
    profile: {
        get: () => api.get('/profile'),
        update: (data: any) => api.put('/profile', data),
        uploadImage: (formData: FormData) => api.post('/profile/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    },

    // Experiences
    experiences: {
        getAll: () => api.get('/experiences'),
        getAllAdmin: () => api.get('/experiences/all'),
        getOne: (id: string) => api.get(`/experiences/${id}`),
        create: (data: any) => api.post('/experiences', data),
        update: (id: string, data: any) => api.put(`/experiences/${id}`, data),
        delete: (id: string) => api.delete(`/experiences/${id}`),
    },

    // Projects
    projects: {
        getAll: () => api.get('/projects'),
        getOne: (id: string) => api.get(`/projects/${id}`),
        create: (formData: FormData) => api.post('/projects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
        update: (id: string, formData: FormData) => api.put(`/projects/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
        delete: (id: string) => api.delete(`/projects/${id}`),
    },

    // Certifications
    certifications: {
        getAll: () => api.get('/certifications'),
        getOne: (id: string) => api.get(`/certifications/${id}`),
        getDownloadUrl: (id: string) => api.get(`/certifications/${id}/download`),
        create: (formData: FormData) => api.post('/certifications', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
        update: (id: string, formData: FormData) => api.put(`/certifications/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
        delete: (id: string) => api.delete(`/certifications/${id}`),
    },

    // Contact
    contact: {
        submit: (data: any) => api.post('/contact', data),
        getAll: () => api.get('/contact'),
        markAsRead: (id: string) => api.patch(`/contact/${id}/read`),
        delete: (id: string) => api.delete(`/contact/${id}`),
    },

    // Auth
    auth: {
        login: (email: string, password: string) => api.post('/auth/login', { email, password }),
        createAdmin: (data: any) => api.post('/auth/create-admin', data),
    },
};

export default api;
