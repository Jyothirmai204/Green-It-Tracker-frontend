import { api } from './client';

// GET /api/sustainability -> SustainabilityResponseDto
export function getLatestMetrics() {
  return api.get('/sustainability');
}

// POST /api/sustainability/calculate -> SustainabilityResponseDto
export function calculateMetrics() {
  return api.post('/sustainability/calculate');
}
