import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAuth } from '../auth/AuthContext';
import { ApiError, coursesApi, lessonsApi, wordsApi } from '../api/endpoints';
import { CloseIcon } from '../components/Icons';

// A minimal authoring helper. The learner-facing app is the focus; this exists only
// because the database seeds no course/lesson/word content, and the API has no way to
// list a course's lessons — so without this there's nothing to actually learn.
// It uses ONLY existing Admin endpoints (create course/word/lesson, add words).

const SAMPLE_WORDS = [
  { text: 'Refreshed', translation: 'Освіжений', partOfSpeech: 'adjective', exampleSentence: 'She felt refreshed after a long walk.', exampleTranslation: 'Вона почувалася освіженою після довгої прогулянки.' },
  { text: 'Meticulous', translation: 'Ретельний', partOfSpeech: 'adjective', exampleSentence: 'He kept meticulous records.', exampleTranslation: 'Він вів ретельні записи.' },
  { text: 'Generous', translation: 'Щедрий', partOfSpeech: 'adjective', exampleSentence: 'A generous host welcomed us.', exampleTranslation: 'Щедрий господар зустрів нас.' },
  { text: 'Curious', translation: 'Допитливий', partOfSpeech: 'adjective', exampleSentence: 'The curious child asked many questions.', exampleTranslation: 'Допитлива дитина ставила багато запитань.' },
  { text: 'Reliable', translation: 'Надійний', partOfSpeech: 'adjective', exampleSentence: 'She is a reliable friend.', exampleTranslation: 'Вона надійна подруга.' },
  { text: 'Brave', translation: 'Хоробрий', partOfSpeech: 'adjective', exampleSentence: 'The brave firefighter ran inside.', exampleTranslation: 'Хоробрий пожежник забіг усередину.' },
];

export function Admin() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'Admin';

  function push(line: string) {
    setLog((l) => [...l, line]);
  }

  async function seedSampleLesson() {
    setBusy(true);
    setError(null);
    setLog([]);
    setLessonId(null);
    try {
      push('Creating course…');
      const course = await coursesApi.create({
        title: 'Everyday English',
        description: 'A calm starter course of useful everyday words.',
        languageLevel: 'A2',
        order: 1,
      });
      push(`✓ Course #${course.id} — ${course.title}`);

      push('Creating words…');
      const wordIds: number[] = [];
      for (const w of SAMPLE_WORDS) {
        const created = await wordsApi.create(w);
        wordIds.push(created.id);
      }
      push(`✓ ${wordIds.length} words created`);

      push('Creating lesson…');
      const lesson = await lessonsApi.create({
        title: 'Describing people',
        order: 1,
        courseId: course.id,
      });
      push(`✓ Lesson #${lesson.id} — ${lesson.title}`);

      push('Attaching words to lesson…');
      await lessonsApi.addWords(lesson.id, wordIds);
      push('✓ Words attached');

      setLessonId(lesson.id);
      push('Done. You can play this lesson now.');
    } catch (e) {
      setError(e instanceof ApiError ? `${e.status} · ${e.message}` : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <div className="row-between" style={{ paddingTop: 6 }}>
        <button
          onClick={() => nav('/profile')}
          aria-label="Back"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0 }}
        >
          <CloseIcon size={24} strokeWidth={2} />
        </button>
      </div>

      <div>
        <div className="eyebrow">Admin</div>
        <h1 className="title" style={{ marginTop: 8 }}>
          Sample content
        </h1>
        <p className="subtle" style={{ marginTop: 8, fontSize: 15, lineHeight: 1.55 }}>
          Create one ready-to-play lesson (a course, six words and a lesson) using the
          existing admin endpoints.
        </p>
      </div>

      {!isAdmin ? (
        <div className="notice">
          You’re signed in as a <b>{user?.role}</b>. Content endpoints require an admin.
          Sign out and sign in with the seeded admin account (see README) to use this page.
        </div>
      ) : (
        <>
          <button className="btn btn-primary" disabled={busy} onClick={seedSampleLesson}>
            {busy ? 'Working…' : 'Create a sample lesson'}
          </button>

          {error && <div className="notice">{error}</div>}

          {log.length > 0 && (
            <div className="card" style={{ boxShadow: 'none' }}>
              <div className="stack" style={{ gap: 6, fontSize: 14, lineHeight: 1.5 }}>
                {log.map((l, i) => (
                  <div key={i} style={{ color: l.startsWith('✓') ? 'var(--accent-ink)' : 'var(--text-2)' }}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}

          {lessonId != null && (
            <Link className="btn btn-primary" to={`/lesson/${lessonId}`} style={{ textAlign: 'center' }}>
              Play lesson #{lessonId}
            </Link>
          )}
        </>
      )}
    </Screen>
  );
}
