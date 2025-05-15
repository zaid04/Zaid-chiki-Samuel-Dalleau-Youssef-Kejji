import axios from 'axios';

const api = axios.create({
  baseURL: 'https://health.shrp.dev', // change selon ton API
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
