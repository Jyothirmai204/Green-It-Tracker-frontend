import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../api/dashboard';
import ScoreGauge from '../components/ScoreGauge';
import Banner from '../components/Banner';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Loading overview…</p>;

  const total = data?.totalResources ?? 0;
  const active = data?.activeResources ?? 0;
  const idle = data?.idleResources ?? 0;
  const other = Math.max(total - active - idle, 0);

  const activePct = total ? (active / total) * 100 : 0;
  const idlePct = total ? (idle / total) * 100 : 0;
  const otherPct = total ? (other / total) * 100 : 0;

  return (
    <div className="page">
      <header className="page-head">
        <h1>Overview</h1>
        <p className="muted">Where your infrastructure stands right now.</p>
      </header>

      <Banner kind="error">{error}</Banner>

      {data && (
        <>
          <section className="hero-row">
            <div className="hero-gauge">
              <ScoreGauge value={data.greenScore} max={100} label="Green Score" />
            </div>

            <div className="hero-distribution">
              <div className="hero-distribution-head">
                <h2>Resource status</h2>
                <span className="muted">{total} total</span>
              </div>

              <div className="segbar" role="img" aria-label="Resource status distribution">
                <span className="segbar-seg segbar-seg--active" style={{ width: `${activePct}%` }} />
                <span className="segbar-seg segbar-seg--idle" style={{ width: `${idlePct}%` }} />
                <span className="segbar-seg segbar-seg--other" style={{ width: `${otherPct}%` }} />
              </div>

              <div className="segbar-legend">
                <span><i className="dot dot--active" />Active — {active}</span>
                <span><i className="dot dot--idle" />Idle — {idle}</span>
                <span><i className="dot dot--other" />Other — {other}</span>
              </div>

              <Link to="/resources" className="link-arrow">View all resources</Link>
            </div>
          </section>

          <section className="stat-strip">
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
            <div className="stat-row">
              <span className="stat-row-label">Open recommendations</span>
              <span className="stat-row-value">{data.recommendationsCount}</span>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function fmt(n) {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 1 });
}
