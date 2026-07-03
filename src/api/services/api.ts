import axios from 'axios';
import { normalizeAxiosError } from '../errors';
import { emitUnauthorized } from '../authEvents';

const TOKEN_KEY = 'access_token';

// Paths where a 401 is surfaced inline (bad password / patient error), NOT a session expiry.
// Exact-match on request `url` (params travel separately, so availability url is exact).
const AUTH_EXEMPT_PATHS = ['/auth/login', '/appointments', '/appointments/availability'];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// 2a. Attach Bearer token when present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2b + 2c. Normalize every error; on session-expiry 401, clear token + emit redirect.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = normalizeAxiosError(error);
    const url: string = error?.config?.url ?? '';
    const isExempt = AUTH_EXEMPT_PATHS.includes(url);

    if (apiError.code === 'auth' && !isExempt) {
      localStorage.removeItem(TOKEN_KEY);
      emitUnauthorized();
    }

    return Promise.reject(apiError);
  },
);

export default api;
