import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Banner from '../components/Banner';

const EMPTY = { firstName: '', lastName: '', email: '', password: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message);
      if (err.validationErrors) setFieldErrors(err.validationErrors);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="brand brand--center">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Green IT Tracker</span>
        </div>
        <p className="auth-sub">Create an account to start tracking your green score.</p>

        <Banner kind="error">{error}</Banner>
        <Banner kind="success">{success ? 'Account created. Taking you to sign in…' : null}</Banner>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label className="field">
              <span>First name</span>
              <input required value={form.firstName} onChange={update('firstName')} />
              {fieldErrors.firstName && <small className="field-error">{fieldErrors.firstName}</small>}
            </label>
            <label className="field">
              <span>Last name</span>
              <input required value={form.lastName} onChange={update('lastName')} />
              {fieldErrors.lastName && <small className="field-error">{fieldErrors.lastName}</small>}
            </label>
          </div>
          <label className="field">
            <span>Email</span>
            <input type="email" required value={form.email} onChange={update('email')} autoComplete="email" />
            {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={update('password')}
              autoComplete="new-password"
            />
            <small className="field-hint">
              8–20 characters, with an uppercase letter, lowercase letter, number, and symbol (@#$%^&amp;+=).
            </small>
            {fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
          </label>
          <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
