import { api } from './client';

// GET /api/resources -> ResourceResponseDto[]
export function getAllResources() {
  return api.get('/resources');
}

// GET /api/resources/{id} -> ResourceResponseDto
export function getResourceById(id) {
  return api.get(`/resources/${id}`);
}

// POST /api/resources (ADMIN/MANAGER) -> ResourceResponseDto
export function createResource({ resourceName, resourceType, status, ownerName, location }) {
  return api.post('/resources', { resourceName, resourceType, status, ownerName, location });
}

// PUT /api/resources/{id} (ADMIN/MANAGER) -> ResourceResponseDto
export function updateResource(id, { resourceName, status, ownerName, location }) {
  return api.put(`/resources/${id}`, { resourceName, status, ownerName, location });
}

// DELETE /api/resources/{id} (ADMIN)
export function deleteResource(id) {
  return api.delete(`/resources/${id}`);
}

export const RESOURCE_TYPES = ['SERVER', 'VM', 'STORAGE', 'APPLICATION', 'DATABASE', 'PRINTER'];
export const RESOURCE_STATUSES = ['ACTIVE', 'IDLE', 'UNDER_UTILIZED', 'DECOMMISSIONED', 'MAINTENANCE'];
