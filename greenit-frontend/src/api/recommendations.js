import { api } from './client';

// GET /api/recommendations -> RecommendationResponseDto[]
export function getAllRecommendations() {
  return api.get('/recommendations');
}

// POST /api/recommendations/generate (ADMIN)
export function generateRecommendations() {
  return api.post('/recommendations/generate');
}
