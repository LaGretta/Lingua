import { Screen } from '../components/Screen';
import { useAuth } from '../auth/AuthContext';
import { useAsync } from '../lib/useAsync';
import { usersApi } from '../api/endpoints';
import type { LeaderboardEntry } from '../api/types';
import { Avatar } from '../components/Avatar';
import { LeafIcon } from '../components/Icons';
import { EmptyState, ErrorState, SkeletonCards } from '../components/States';

export function Leaderboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(() => usersApi.leaderboard(), []);

  return (
    <Screen tabbar>
      <div style={{ padding: '8px 0 4px' }}>
        <div className="title">Leaderboard</div>
        <div className="caption" style={{ marginTop: 4 }}>
          Top learners by XP
        </div>
      </div>

      {loading && <SkeletonCards count={5} />}
      {error && <ErrorState message="Couldn’t load the leaderboard." onRetry={reload} />}

      {data && data.length === 0 && (
        <EmptyState
          icon={
            <div style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
              <LeafIcon size={34} strokeWidth={1.6} />
            </div>
          }
          title="No rankings yet"
          body="Complete a lesson to earn XP and appear on the leaderboard."
        />
      )}

      {data && data.length > 0 && (
        <div className="stack" style={{ gap: 8 }}>
          {data.map((entry) => (
            <Row key={`${entry.rank}-${entry.username}`} entry={entry} isMe={entry.username === user?.username} />
          ))}
        </div>
      )}
    </Screen>
  );
}

function Row({ entry, isMe }: { entry: LeaderboardEntry; isMe: boolean }) {
  const topThree = entry.rank <= 3;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: isMe ? '14px 12px' : '12px 8px',
        borderRadius: isMe ? 18 : 0,
        background: isMe ? 'var(--accent-soft)' : 'transparent',
        border: isMe ? '1.5px solid var(--accent)' : 'none',
        borderBottom: isMe ? '1.5px solid var(--accent)' : '1px solid var(--hairline)',
      }}
    >
      <div
        style={{
          width: 26,
          textAlign: 'center',
          fontSize: 16,
          fontWeight: topThree ? 800 : 700,
          color: topThree ? 'var(--accent)' : 'var(--text-3)',
        }}
      >
        {entry.rank}
      </div>
      <Avatar seed={entry.username} size={40} accent={isMe} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: isMe ? 700 : 600,
            color: isMe ? 'var(--accent-ink)' : 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {entry.username}
          {isMe && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}> · You</span>}
        </div>
        <div className="caption" style={{ marginTop: 2 }}>
          {entry.currentStreakDays} {entry.currentStreakDays === 1 ? 'day' : 'days'} streak
        </div>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: isMe ? 800 : 700,
          color: isMe ? 'var(--accent-ink)' : 'var(--text)',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.totalXp.toLocaleString()}
        <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}> XP</span>
      </div>
    </div>
  );
}
