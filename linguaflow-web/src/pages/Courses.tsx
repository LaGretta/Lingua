import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAsync } from '../lib/useAsync';
import { coursesApi } from '../api/endpoints';
import { ChevronRight } from '../components/Icons';
import { Ring } from '../components/Ring';
import { ErrorState, SkeletonCards } from '../components/States';

export function Courses() {
  const nav = useNavigate();
  const { data, loading, error, reload } = useAsync(() => coursesApi.list(), []);

  return (
    <Screen tabbar>
      <div style={{ padding: '8px 0 4px' }}>
        <div className="title">Courses</div>
        <div className="caption" style={{ marginTop: 4 }}>
          English · from beginner to fluent
        </div>
      </div>

      {loading && <SkeletonCards count={4} />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {data && data.length === 0 && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16 }}>No courses yet</div>
          <p className="caption" style={{ marginTop: 4, lineHeight: 1.5 }}>
            An admin needs to create courses. See the README’s “Sample content” section to
            add some (or use the in-app Admin page while signed in as an admin).
          </p>
        </div>
      )}

      {data?.map((c) => (
        <button
          key={c.id}
          className="card row-between"
          style={{ gap: 16, cursor: 'pointer', textAlign: 'left', font: 'inherit', display: 'flex' }}
          onClick={() => nav(`/courses/${c.id}`)}
        >
          <Ring percent={0} size={52} thickness={6}>
            <span style={{ fontSize: 12, fontWeight: 800 }}>{c.languageLevel}</span>
          </Ring>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{c.title}</div>
            <div className="caption" style={{ marginTop: 2 }}>
              {c.lessonsCount} {c.lessonsCount === 1 ? 'lesson' : 'lessons'} · {c.languageLevel}
            </div>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--accent)' }} />
        </button>
      ))}
    </Screen>
  );
}
