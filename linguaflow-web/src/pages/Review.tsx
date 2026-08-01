import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAsync } from '../lib/useAsync';
import { ApiError, reviewApi } from '../api/endpoints';
import type { ReviewGrade, ReviewWord } from '../api/types';
import { CheckIcon, CloseIcon } from '../components/Icons';
import { EmptyState, ErrorState, Loading } from '../components/States';

const GRADES: { grade: ReviewGrade; recommended?: boolean }[] = [
  { grade: 'Again' },
  { grade: 'Hard' },
  { grade: 'Good', recommended: true },
  { grade: 'Easy' },
];

// A calm ring badge reused by the empty / complete states.
function DoneBadge() {
  return (
    <div style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
      <CheckIcon size={36} strokeWidth={2.2} />
    </div>
  );
}

// Header for the "landing" states (loading / empty / complete). Review is a bottom-tab
// destination, so these keep the normal tab bar (via <Screen tabbar>) and a title —
// no lone floating ✕.
function ReviewHeader() {
  return (
    <div style={{ padding: '8px 0 4px' }}>
      <div className="title">Review</div>
      <div className="caption" style={{ marginTop: 4 }}>
        Spaced repetition
      </div>
    </div>
  );
}

export function Review() {
  const nav = useNavigate();
  const { data, loading, error, reload } = useAsync(() => reviewApi.today(), []);

  if (loading) {
    return (
      <Screen tabbar>
        <ReviewHeader />
        <Loading label="Loading today’s review…" />
      </Screen>
    );
  }
  if (error) {
    return (
      <Screen tabbar>
        <ReviewHeader />
        <ErrorState message={error} onRetry={reload} />
      </Screen>
    );
  }
  if (!data || data.length === 0) {
    return (
      <Screen tabbar>
        <ReviewHeader />
        <EmptyState
          icon={<DoneBadge />}
          title="All done for today"
          body="No words are due right now. As you learn and grade words, spaced repetition schedules them here on the day they’re due — check back tomorrow."
        />
      </Screen>
    );
  }

  return <ReviewRunner queue={data} onExit={() => nav('/')} />;
}

function ReviewRunner({ queue, onExit }: { queue: ReviewWord[]; onExit: () => void }) {
  const total = queue.length;
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const card = queue[index];
  const progress = Math.round((index / total) * 100);

  async function grade(g: ReviewGrade) {
    setBusy(true);
    setErr(null);
    try {
      await reviewApi.grade({ wordId: card.wordId, grade: g });
      if (index + 1 >= total) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
        setRevealed(false);
      }
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Could not save your grade.');
    } finally {
      setBusy(false);
    }
  }

  // Session finished → restore the normal tab bar and show a calm summary.
  if (done) {
    return (
      <Screen tabbar>
        <ReviewHeader />
        <EmptyState
          icon={<DoneBadge />}
          title="Review complete"
          body={`You reviewed ${total} ${total === 1 ? 'word' : 'words'}. Nicely done.`}
          action={
            <button className="btn btn-primary" style={{ width: 'auto', padding: '14px 26px' }} onClick={onExit}>
              Back home
            </button>
          }
        />
      </Screen>
    );
  }

  // Active session → focused mode (no tab bar), with a clear header: close, progress, count.
  return (
    <Screen>
      <SessionTop onExit={onExit} progress={progress} index={index} total={total} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="card"
          style={{ width: '100%', borderRadius: 'var(--r-sheet)', boxShadow: 'var(--sh-raised)', padding: '34px 28px', textAlign: 'center' }}
        >
          <div className="eyebrow" style={{ color: 'var(--text-3)' }}>
            Word
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 14, letterSpacing: '-1px' }}>
            {card.text}
          </div>

          <div className="divider" style={{ margin: '22px 0' }} />

          {revealed ? (
            <>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent-ink)' }}>
                {card.translation}
              </div>
              {card.exampleSentence && (
                <div className="subtle" style={{ fontSize: 15, lineHeight: 1.5, marginTop: 14, fontStyle: 'italic' }}>
                  “{card.exampleSentence}”
                </div>
              )}
            </>
          ) : (
            <button className="btn btn-secondary" onClick={() => setRevealed(true)} style={{ marginTop: 4 }}>
              Show answer
            </button>
          )}
        </div>
      </div>

      {err && <div className="notice" style={{ marginBottom: 10 }}>{err}</div>}

      <div className="caption" style={{ textAlign: 'center', color: 'var(--text-3)', marginBottom: 14 }}>
        How well did you know it?
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {GRADES.map(({ grade: g, recommended }) => (
          <button
            key={g}
            className={`option${recommended ? ' correct' : ''}`}
            style={{ flex: 1, justifyContent: 'center', padding: '14px 0', fontSize: 14, borderRadius: 14 }}
            disabled={!revealed || busy}
            onClick={() => grade(g)}
          >
            {g}
          </button>
        ))}
      </div>
    </Screen>
  );
}

// Focused-session header, mirroring the Lesson player: close ✕, progress bar, count.
function SessionTop({
  onExit,
  progress,
  index,
  total,
}: {
  onExit: () => void;
  progress: number;
  index: number;
  total: number;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '6px 0 18px' }}>
      <button
        onClick={onExit}
        aria-label="Close review"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0 }}
      >
        <CloseIcon size={24} strokeWidth={2} />
      </button>
      <div className="progress" style={{ flex: 1 }}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', minWidth: 42, textAlign: 'right' }}>
        {index + 1} / {total}
      </span>
    </div>
  );
}
