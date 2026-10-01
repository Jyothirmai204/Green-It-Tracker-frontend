import { useEffect, useState } from 'react';
import { getAllRecommendations, generateRecommendations } from '../api/recommendations';
import Banner from '../components/Banner';

export default function RecommendationsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  function load() {
    setLoading(true);
    getAllRecommendations()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleGenerate() {
    setError('');
    setNotice('');
    setGenerating(true);
    try {
      await generateRecommendations();
      setNotice('New recommendations generated.');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="page">
      <header className="page-head page-head--row">
        <div>
          <h1>Recommendations</h1>
          <p className="muted">Suggested changes to raise your green score.</p>
        </div>
        <button className="btn btn--primary" onClick={handleGenerate} disabled={generating}>
          {generating ? 'Generating…' : 'Generate recommendations'}
        </button>
      </header>

      <Banner kind="error">{error}</Banner>
      <Banner kind="success">{notice}</Banner>

      {loading ? (
        <p className="muted">Loading recommendations…</p>
      ) : items.length === 0 ? (
        <p className="muted">No recommendations yet. Generate the first batch above.</p>
      ) : (
        <ul className="rec-list">
          {items.map((rec) => (
            <li key={rec.id} className={`rec-card rec-card--${rec.priority?.toLowerCase()}`}>
              <div className="rec-card-top">
                <span className={`priority-pill priority-pill--${rec.priority?.toLowerCase()}`}>
                  {rec.priority}
                </span>
                <span className="rec-savings">
                  Est. savings: <strong>₹{Number(rec.estimatedSavings).toLocaleString(undefined, { maximumFractionDigits: 1 })}</strong>
                </span>
              </div>
              <p className="rec-issue">{rec.issue}</p>
              <p className="rec-text">{rec.recommendation}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
