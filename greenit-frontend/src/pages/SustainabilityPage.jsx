import { useEffect, useState } from 'react';
import { getLatestMetrics, calculateMetrics } from '../api/sustainability';
import ScoreGauge from '../components/ScoreGauge';
import Banner from '../components/Banner';

export default function SustainabilityPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  function load() {
    setLoading(true);
    getLatestMetrics()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCalculate() {
    setError('');
    setCalculating(true);
    try {
      const result = await calculateMetrics();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setCalculating(false);
    }
  }

  return (
    <div className="page">
      <header className="page-head page-head--row">
        <div>
          <h1>Sustainability</h1>
          <p className="muted">Energy, carbon, and cost impact, recalculated on demand.</p>
        </div>
        <button className="btn btn--primary" onClick={handleCalculate} disabled={calculating}>
          {calculating ? 'Calculating…' : 'Recalculate metrics'}
        </button>
      </header>

      <Banner kind="error">{error}</Banner>

      {loading ? (
        <p className="muted">Loading metrics…</p>
      ) : data ? (
        <section className="hero-row">
          <div className="hero-gauge">
            <ScoreGauge value={data.greenScore} max={100} label="Green Score" />
          </div>
          <div className="stat-strip stat-strip--grow">
            <div className="stat-row">
              <span className="stat-row-label">Energy saved</span>
              <span className="stat-row-value">{fmt(data.energySaved)} <small>kWh</small></span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Carbon saved</span>
              <span className="stat-row-value">{fmt(data.carbonSaved)} <small>kg CO₂e</small></span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Cost saved</span>
              <span className="stat-row-value">₹{fmt(data.costSaved)}</span>
            </div>
          </div>
        </section>
      ) : (
        <p className="muted">No metrics recorded yet.</p>
      )}
    </div>
  );
}

function fmt(n) {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 1 });
}
