// A 270-degree arc gauge. No chart library needed for one shape -
// plain SVG with stroke-dasharray keeps this lightweight.
export default function ScoreGauge({ value = 0, max = 100, label = 'Green Score' }) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75; // 270 of 360 degrees
  const arcLength = circumference * arcFraction;
  const dashOffset = arcLength * (1 - pct);

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 200" className="gauge-svg">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth="14"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset="0"
          transform="rotate(135 100 100)"
          strokeLinecap="round"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="14"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform="rotate(135 100 100)"
          strokeLinecap="round"
          className="gauge-value-arc"
        />
      </svg>
      <div className="gauge-readout">
        <span className="gauge-number">{Math.round(value)}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}
