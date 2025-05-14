// src/services/api.ts
import axios from 'axios';

const api = axios.create({ baseURL: 'https://health.shrp.dev' });

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;  // ✅
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
