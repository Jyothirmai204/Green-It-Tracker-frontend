import { api } from './client';

// GET /api/dashboard/summary -> DashboardResponseDto
export function getDashboardSummary() {
  return api.get('/dashboard/summary');
}
