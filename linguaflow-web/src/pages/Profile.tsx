import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAuth } from '../auth/AuthContext';
import { useAsync } from '../lib/useAsync';
import { usersApi } from '../api/endpoints';
import { Avatar } from '../components/Avatar';

export function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  // Live profile (streak + XP) from GET /api/users/me.
  const { data: me, loading, error } = useAsync(() => usersApi.me(), []);

  const fmt = (n: number | undefined) =>
    loading ? '…' : n == null ? '—' : n.toLocaleString();

  // The profile DTO exposes streak + XP; words-learned / longest-streak aren't tracked yet.
  const stats: { label: string; value: string }[] = [
    { label: 'Day streak', value: fmt(me?.currentStreakDays) },
    { label: 'Total XP', value: fmt(me?.totalXp) },
    { label: 'Words learned', value: '—' },
    { label: 'Longest streak', value: '—' },
  ];

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

      {error && (
        <div className="notice">Couldn’t load your profile stats. Please try again.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ padding: 18, boxShadow: 'none' }}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: s.value === '—' || s.value === '…' ? 'var(--text-3)' : 'var(--text)',
              }}
            >
              {s.value}
            </div>
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
