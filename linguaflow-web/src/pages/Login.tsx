import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/client';

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login({ email, password });
      nav('/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <div style={{ paddingTop: 24 }}>
        <div className="eyebrow">Welcome back</div>
        <h1 className="title" style={{ marginTop: 8 }}>
          Sign in
        </h1>
      </div>

      <form className="stack" style={{ gap: 16, marginTop: 8 }} onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && <div className="notice">{error}</div>}

        <button className="btn btn-primary" disabled={busy} style={{ marginTop: 4 }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="subtle" style={{ fontSize: 15, textAlign: 'center', marginTop: 4 }}>
        New here? <Link to="/register">Create an account</Link>
      </div>
    </Screen>
  );
}
