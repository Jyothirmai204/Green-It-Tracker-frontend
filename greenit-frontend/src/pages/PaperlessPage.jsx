import { useEffect, useState } from 'react';
import { getLatestPaperlessMetric, createPaperlessMetric } from '../api/paperless';
import Banner from '../components/Banner';

const EMPTY = { printedPages: '', digitalDocuments: '', paperSaved: '' };

export default function PaperlessPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    getLatestPaperlessMetric()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        printedPages: Number(form.printedPages),
        digitalDocuments: Number(form.digitalDocuments),
        paperSaved: Number(form.paperSaved),
      };
      const result = await createPaperlessMetric(payload);
      setData(result);
      setForm(EMPTY);
      setNotice('Paperless metric logged.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Paperless</h1>
        <p className="muted">Track how much paper your team is avoiding.</p>
      </header>

      <Banner kind="error">{error}</Banner>
      <Banner kind="success">{notice}</Banner>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : data ? (
        <section className="stat-strip">
          <div className="stat-row">
            <span className="stat-row-label">Printed pages</span>
            <span className="stat-row-value">{data.printedPages}</span>
          </div>
          <div className="stat-row">
            <span className="stat-row-label">Digital documents</span>
            <span className="stat-row-value">{data.digitalDocuments}</span>
          </div>
          <div className="stat-row">
            <span className="stat-row-label">Paper saved</span>
            <span className="stat-row-value">{data.paperSaved} <small>sheets</small></span>
          </div>
        </section>
      ) : (
        <p className="muted">No paperless metrics logged yet.</p>
      )}

      <form onSubmit={handleSubmit} className="form form--card">
        <h2 className="form-title">Log today's numbers</h2>
        <div className="form-row">
          <label className="field">
            <span>Printed pages</span>
            <input type="number" min="0" required value={form.printedPages} onChange={update('printedPages')} />
          </label>
          <label className="field">
            <span>Digital documents</span>
            <input type="number" min="0" required value={form.digitalDocuments} onChange={update('digitalDocuments')} />
          </label>
          <label className="field">
            <span>Paper saved</span>
            <input type="number" min="0" required value={form.paperSaved} onChange={update('paperSaved')} />
          </label>
        </div>
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save metric'}
        </button>
      </form>
    </div>
  );
}
