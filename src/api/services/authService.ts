import api from './api';

interface LoginData {
  token: string;
  expiresIn: string; // e.g. "7d" — string, not a number
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/** POST /api/auth/login — throws ApiError (code 'auth') on bad credentials. */
export async function loginRequest(username: string, password: string): Promise<LoginData> {
  const { data } = await api.post<ApiEnvelope<LoginData>>('/auth/login', { username, password });
  return data.data;
}
