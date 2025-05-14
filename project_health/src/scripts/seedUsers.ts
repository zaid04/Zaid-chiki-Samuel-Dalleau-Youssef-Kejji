// src/scripts/seedUsers.ts
import api from '../services/api';
await api.post('/users', { email: 'coach@test.com', password: '123', role: 'pro' });
await api.post('/users', { email: 'patient@test.com', password: '123', role: 'patient' });
console.log('Seed OK');
