import { api } from './client';

// POST /api/auth/register -> RegisterResponseDto { userId, fullName, email }
export function register({ firstName, lastName, email, password }) {
  return api.post('/auth/register', { firstName, lastName, email, password }, { auth: false });
}

// POST /api/auth/login -> LoginResponseDto { userId, fullName, email, token }
export function login({ email, password }) {
  return api.post('/auth/login', { email, password }, { auth: false });
}
