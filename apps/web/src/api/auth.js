import { http } from './http';

export async function register({ username, email, password }) {
    const res = await http.post('/api/auth/register', { username, email, password });
    return res.data;
}

export async function login({ email, password }) {
    const res = await http.post('/api/auth/login', { email, password });
    return res.data;
}

export async function getProfile() {
    const res = await http.get('/api/auth/profile');
    return res.data;
}