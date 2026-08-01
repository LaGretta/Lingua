import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/client';

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register({ username, email, password });
      nav('/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create your account.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <div style={{ paddingTop: 24 }}>
        <div className="eyebrow">Start learning</div>
        <h1 className="title" style={{ marginTop: 8 }}>
          Create account
        </h1>
      </div>

      <form className="stack" style={{ gap: 16, marginTop: 8 }} onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="input"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="anna"
            required
          />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            required
          />
        </div>

        {error && <div className="notice">{error}</div>}

        <button className="btn btn-primary" disabled={busy} style={{ marginTop: 4 }}>
          {busy ? 'Creating…' : 'Get started'}
        </button>
      </form>

      <div className="subtle" style={{ fontSize: 15, textAlign: 'center', marginTop: 4 }}>
        Already learning? <Link to="/login">Sign in</Link>
      </div>
    </Screen>
  );
}
