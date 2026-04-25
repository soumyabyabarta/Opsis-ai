import axios from 'axios';
const BASE_URL = 'https://opsis-server.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// Attach JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('opsis_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-create session on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('opsis_token');
      localStorage.removeItem('opsis_session');
    }
    return Promise.reject(err);
  }
);

// ── Session ──────────────────────────────────────────────
export const createSession = () => api.post('/sessions/create');
export const getSessionInfo = () => api.get('/sessions/info');
export const deleteSession = () => api.delete('/sessions/delete');

// ── Reports ──────────────────────────────────────────────
export const analyzeReport = (data) => api.post('/reports/analyze', data);
export const getReports = () => api.get('/reports');
export const getReport = (id) => api.get(`/reports/${id}`);
export const deleteReport = (id) => api.delete(`/reports/${id}`);

// ── Symptoms ─────────────────────────────────────────────
export const analyzeSymptoms = (symptoms) => api.post('/symptoms/analyze', { symptoms });

export default api;
