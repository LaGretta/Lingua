import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAuth } from '../auth/AuthContext';
import { Avatar } from '../components/Avatar';

const STATS = [
  { label: 'Day streak' },
  { label: 'Total XP' },
  { label: 'Words learned' },
  { label: 'Longest streak' },
] as const;

export function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <Screen tabbar>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '6px 0' }}>
        <Avatar seed={user?.username ?? 'you'} size={68} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.4px' }}>
            {user?.username}
          </div>
          <div className="caption" style={{ marginTop: 2 }}>
            {user?.email}
          </div>
          <div className="pill" style={{ marginTop: 8 }}>
            {user?.planTier} · {user?.role}
          </div>
        </div>
      </div>

      {/* The API exposes no profile/stats endpoint and the auth response carries no
          streak/XP, so these tiles can't be populated with real data yet. */}
      <div className="notice info">
        Streak, XP and word counts aren’t available from the API yet — there’s no profile
        endpoint. See the README → “Known API gaps”.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {STATS.map((s) => (
          <div key={s.label} className="card" style={{ padding: 18, boxShadow: 'none' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-3)' }}>—</div>
            <div className="caption" style={{ marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {user?.role === 'Admin' && (
        <button
          className="btn btn-secondary"
          onClick={() => nav('/admin')}
          style={{ marginTop: 4 }}
        >
          Admin · manage content
        </button>
      )}

      <button
        className="btn btn-secondary"
        onClick={() => {
          logout();
          nav('/welcome', { replace: true });
        }}
        style={{ color: 'var(--warn-ink)', borderColor: 'rgba(180,112,58,.3)' }}
      >
        Sign out
      </button>
    </Screen>
  );
}
