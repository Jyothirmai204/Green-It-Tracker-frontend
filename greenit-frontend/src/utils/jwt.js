// Minimal JWT payload decode (no signature check - that's the backend's job).
// The backend only puts the username (email) in the `sub` claim and an
// expiration, so that's all we can reliably read client-side.
export function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isExpired(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}
