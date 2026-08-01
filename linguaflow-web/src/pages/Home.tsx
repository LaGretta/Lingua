import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAuth } from '../auth/AuthContext';
import { useAsync } from '../lib/useAsync';
import { coursesApi, reviewApi } from '../api/endpoints';
import { ChevronRight, LeafIcon } from '../components/Icons';
import { SkeletonCards } from '../components/States';
import { Avatar } from '../components/Avatar';

export function Home() {
  const { user } = useAuth();
  const nav = useNavigate();

  // Both are real endpoints. Streak/XP/level are NOT available from the API
  // (no profile endpoint; the auth response omits them) — see README.
  const courses = useAsync(() => coursesApi.list(), []);
  const review = useAsync(() => reviewApi.today(), []);

  const firstCourse = courses.data?.[0];
  const reviewCount = review.data?.length ?? 0;

  return (
    <Screen tabbar>
      <div className="row-between">
        <div>
          <div className="caption">Good to see you</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-.5px' }}>
            {user?.username ?? 'Learner'}
          </div>
        </div>
        <Avatar seed={user?.username ?? 'you'} size={46} />
      </div>

      {/* Streak card — the API doesn't expose streak/level yet, so this is a calm
          motivational entry rather than fabricated numbers. */}
      <div className="card row-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'var(--accent-soft)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--accent)',
            }}
          >
            <LeafIcon size={24} strokeWidth={1.6} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Keep the flow going</div>
            <div className="caption" style={{ marginTop: 3 }}>
              A few quiet minutes a day
            </div>
          </div>
        </div>
      </div>

      {/* Continue learning */}
      <div className="eyebrow" style={{ marginTop: 2 }}>
        Continue learning
      </div>
      {courses.loading ? (
        <SkeletonCards count={1} />
      ) : courses.error ? (
        <div className="notice">Couldn’t load courses: {courses.error}</div>
      ) : firstCourse ? (
        <div className="card flush">
          <div
            style={{
              height: 118,
              background:
                'repeating-linear-gradient(135deg,#EFEDE7 0 13px,#F5F3EE 13px 26px)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, letterSpacing: 1, color: '#B4AFA4' }}>
              {firstCourse.title.toUpperCase()}
            </span>
          </div>
          <div style={{ padding: '18px 20px' }}>
            <div className="eyebrow">{firstCourse.languageLevel}</div>
            <div style={{ fontSize: 19, fontWeight: 700, marginTop: 6, letterSpacing: '-.3px' }}>
              {firstCourse.title}
            </div>
            <div className="caption" style={{ marginTop: 3 }}>
              {firstCourse.lessonsCount} {firstCourse.lessonsCount === 1 ? 'lesson' : 'lessons'}
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 16, fontSize: 16, padding: 16 }}
              onClick={() => nav(`/courses/${firstCourse.id}`)}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16 }}>No courses yet</div>
          <p className="caption" style={{ marginTop: 4, lineHeight: 1.5 }}>
            Courses are created by an admin. See the README for how to add sample content.
          </p>
        </div>
      )}

      {/* Review entry */}
      <button
        className="card row-between"
        onClick={() => nav('/review')}
        style={{ cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {review.loading
              ? 'Checking your review…'
              : reviewCount > 0
                ? `${reviewCount} ${reviewCount === 1 ? 'word' : 'words'} to review`
                : 'Nothing due to review'}
          </div>
          <div className="caption" style={{ marginTop: 3 }}>
            Spaced repetition
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 600, fontSize: 15 }}>
          Review <ChevronRight size={18} />
        </div>
      </button>
    </Screen>
  );
}
