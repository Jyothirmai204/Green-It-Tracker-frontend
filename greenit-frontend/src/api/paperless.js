import { api } from './client';

// GET /api/paperless -> PaperlessMetricResponseDto (latest)
export function getLatestPaperlessMetric() {
  return api.get('/paperless');
}

// POST /api/paperless -> PaperlessMetricResponseDto
export function createPaperlessMetric({ printedPages, digitalDocuments, paperSaved }) {
  return api.post('/paperless', { printedPages, digitalDocuments, paperSaved });
}
