const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

const TOKEN_KEY = 'git_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * ApiError carries the HTTP status and the backend's message/validationErrors
 * (see ErrorResponseDto on the backend) so screens can show something useful.
 */
export class ApiError extends Error {
  constructor(message, status, validationErrors) {
    super(message);
    this.status = status;
    this.validationErrors = validationErrors || null;
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Could not reach the server. Check that the backend is running and reachable.',
      0
    );
  }

  // 204 No Content or empty bodies
  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;

  if (!res.ok) {
    if (res.status === 401) {
      setToken(null);
    }
    const message =
      payload?.message ||
      (res.status === 403
        ? "You don't have permission to do that."
        : `Request failed (${res.status}).`);
    throw new ApiError(message, res.status, payload?.validationErrors);
  }

  // Backend wraps successful responses in ApiResponseDto { success, message, status, timestamp, data }
  return payload?.data !== undefined ? payload.data : payload;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
