import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Banner from '../components/Banner';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
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
        <p className="auth-sub">Sign in to see where your infrastructure stands.</p>

        <Banner kind="error">{error}</Banner>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>Email</span>
            <input type="email" required value={form.email} onChange={update('email')} autoComplete="email" />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" required value={form.password} onChange={update('password')} autoComplete="current-password" />
          </label>
          <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-foot">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
