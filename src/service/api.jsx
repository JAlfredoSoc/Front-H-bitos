// src/service/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000', // Tu URL del backend
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default API;