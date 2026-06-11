import axios from 'axios';

const baseURL = 'http://localhost:4000';


export const http = axios.create({ baseURL });

export function setAuthToken(token) {
    if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete http.defaults.headers.common.Authorization;
}