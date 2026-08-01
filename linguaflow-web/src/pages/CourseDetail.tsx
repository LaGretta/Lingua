import { useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAsync } from '../lib/useAsync';
import { coursesApi } from '../api/endpoints';
import { getCourseLessons } from '../lib/discoverLessons';
import { ChevronRight, CloseIcon, LockIcon } from '../components/Icons';
import { CourseCover } from '../components/CourseCover';
import { EmptyState, ErrorState, Loading, SkeletonCards } from '../components/States';

export function CourseDetail() {
  const { id } = useParams();
  const courseId = Number(id);
  const nav = useNavigate();

  const course = useAsync(() => coursesApi.get(courseId), [courseId]);
  const lessons = useAsync(() => getCourseLessons(courseId), [courseId]);

  const playable = lessons.data?.filter((l) => l.hasWords) ?? [];

  return (
    <Screen>
      <div className="row-between" style={{ paddingTop: 6 }}>
        <button
          onClick={() => nav('/courses')}
          aria-label="Back to courses"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0 }}
        >
          <CloseIcon size={24} strokeWidth={2} />
        </button>
      </div>

      {course.loading && <Loading label="Loading course…" />}
      {course.error && <ErrorState message={course.error} onRetry={course.reload} />}

      {course.data && (
        <>
          <div className="card flush">
            <CourseCover level={course.data.languageLevel} height={128} />
          </div>
          <div>
            <div className="eyebrow">{course.data.languageLevel}</div>
            <h1 className="title" style={{ marginTop: 8 }}>
              {course.data.title}
            </h1>
            {course.data.description && (
              <p className="subtle" style={{ marginTop: 8, lineHeight: 1.55, fontSize: 15 }}>
                {course.data.description}
              </p>
            )}
          </div>

          <div className="eyebrow" style={{ marginTop: 2 }}>
            Lessons
          </div>

          {lessons.loading && <SkeletonCards count={Math.min(course.data.lessonsCount || 2, 4)} />}
          {lessons.error && <ErrorState message="Couldn’t load the lessons." onRetry={lessons.reload} />}

          {lessons.data && lessons.data.length === 0 && (
            <EmptyState
              title="No lessons yet"
              body="This course doesn’t have any lessons yet. Check back soon."
            />
          )}

          {lessons.data && lessons.data.length > 0 && playable.length === 0 && (
            <div className="notice info">
              This course’s lessons don’t have any words yet, so there’s nothing to play here
              for now.
            </div>
          )}

          {lessons.data?.map((lesson, i) => {
            const disabled = !lesson.hasWords;
            return (
              <button
                key={lesson.id}
                className="card row-between"
                disabled={disabled}
                onClick={() => !disabled && nav(`/lesson/${lesson.id}`)}
                style={{
                  gap: 14,
                  display: 'flex',
                  textAlign: 'left',
                  font: 'inherit',
                  cursor: disabled ? 'default' : 'pointer',
                  opacity: disabled ? 0.62 : 1,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    background: disabled ? 'var(--disabled-bg)' : 'var(--accent-soft)',
                    color: disabled ? 'var(--text-3)' : 'var(--accent)',
                    fontWeight: 800,
                    fontSize: 15,
                  }}
                >
                  {disabled ? <LockIcon size={18} /> : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{lesson.title}</div>
                  <div className="caption" style={{ marginTop: 2 }}>
                    {disabled ? 'No words yet' : 'Tap to start'}
                  </div>
                </div>
                {!disabled && <ChevronRight size={20} style={{ color: 'var(--accent)' }} />}
              </button>
            );
          })}
        </>
      )}
    </Screen>
  );
}
