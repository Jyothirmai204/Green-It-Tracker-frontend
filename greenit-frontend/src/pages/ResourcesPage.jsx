import { useEffect, useState } from 'react';
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  RESOURCE_TYPES,
  RESOURCE_STATUSES,
} from '../api/resources';
import Banner from '../components/Banner';

const EMPTY_FORM = {
  resourceName: '',
  resourceType: RESOURCE_TYPES[0],
  status: RESOURCE_STATUSES[0],
  ownerName: '',
  location: '',
};

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  function load() {
    setLoading(true);
    getAllResources()
      .then(setResources)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function updateField(setter) {
    return (field) => (e) => setter((f) => ({ ...f, [field]: e.target.value }));
  }
  const updateCreate = updateField(setForm);
  const updateEdit = updateField(setEditForm);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const created = await createResource(form);
      setResources((r) => [created, ...r]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setNotice('Resource created.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(resource) {
    setEditingId(resource.id);
    setEditForm({
      resourceName: resource.resourceName,
      status: resource.status,
      ownerName: resource.ownerName,
      location: resource.location,
    });
  }

  async function handleUpdate(e, id) {
    e.preventDefault();
    setError('');
    try {
      const updated = await updateResource(id, editForm);
      setResources((r) => r.map((item) => (item.id === id ? updated : item)));
      setEditingId(null);
      setNotice('Resource updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this resource? This cannot be undone.')) return;
    setError('');
    try {
      await deleteResource(id);
      setResources((r) => r.filter((item) => item.id !== id));
      setNotice('Resource deleted.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-head page-head--row">
        <div>
          <h1>Resources</h1>
          <p className="muted">Servers, storage, and everything else under tracking.</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'Add resource'}
        </button>
      </header>

      <Banner kind="error">{error}</Banner>
      <Banner kind="success">{notice}</Banner>

      {showForm && (
        <form onSubmit={handleCreate} className="form form--card">
          <div className="form-row">
            <label className="field">
              <span>Name</span>
              <input required value={form.resourceName} onChange={updateCreate('resourceName')} />
            </label>
            <label className="field">
              <span>Type</span>
              <select value={form.resourceType} onChange={updateCreate('resourceType')}>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label className="field">
              <span>Status</span>
              <select value={form.status} onChange={updateCreate('status')}>
                {RESOURCE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Owner</span>
              <input required value={form.ownerName} onChange={updateCreate('ownerName')} />
            </label>
          </div>
          <label className="field">
            <span>Location</span>
            <input required value={form.location} onChange={updateCreate('location')} />
          </label>
          <button className="btn btn--primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save resource'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading resources…</p>
      ) : resources.length === 0 ? (
        <p className="muted">No resources yet. Add the first one above.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Location</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {resources.map((r) =>
              editingId === r.id ? (
                <tr key={r.id} className="table-row--editing">
                  <td colSpan={6}>
                    <form onSubmit={(e) => handleUpdate(e, r.id)} className="inline-edit">
                      <input value={editForm.resourceName} onChange={updateEdit('resourceName')} />
                      <select value={editForm.status} onChange={updateEdit('status')}>
                        {RESOURCE_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <input value={editForm.ownerName} onChange={updateEdit('ownerName')} />
                      <input value={editForm.location} onChange={updateEdit('location')} />
                      <button className="btn btn--primary btn--sm" type="submit">Save</button>
                      <button className="btn btn--ghost btn--sm" type="button" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={r.id}>
                  <td>{r.resourceName}</td>
                  <td><code>{r.resourceType}</code></td>
                  <td>
                    <span className={`status-pill status-pill--${r.status.toLowerCase()}`}>{r.status}</span>
                  </td>
                  <td>{r.ownerName}</td>
                  <td>{r.location}</td>
                  <td className="table-actions">
                    <button className="btn btn--ghost btn--sm" onClick={() => startEdit(r)}>Edit</button>
                    <button className="btn btn--ghost btn--sm btn--danger" onClick={() => handleDelete(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
