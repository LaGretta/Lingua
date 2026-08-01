import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useAsync } from '../lib/useAsync';
import { ApiError, lessonsApi } from '../api/endpoints';
import type { AnswerResult, ExercisePlay } from '../api/types';
import { CheckIcon, CloseIcon, LeafIcon } from '../components/Icons';
import { EmptyState, ErrorState, Loading } from '../components/States';

type Phase = 'answering' | 'revealed';

export function Lesson() {
  const { id } = useParams();
  const lessonId = Number(id);
  const nav = useNavigate();

  const { data: exercises, loading, error, reload } = useAsync(
    () => lessonsApi.exercises(lessonId),
    [lessonId],
  );

  if (loading) {
    return (
      <Screen>
        <TopBar onClose={() => nav(-1)} progress={0} label="…" />
        <Loading label="Preparing your lesson…" />
      </Screen>
    );
  }
  // A lesson with no words linked isn't an error — show a calm, guiding empty state.
  const noWords = !!error && error.includes('no words');
  if (noWords || (exercises && exercises.length === 0)) {
    return (
      <Screen>
        <TopBar onClose={() => nav(-1)} progress={0} label="" />
        <EmptyState
          icon={
            <div style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
              <LeafIcon size={34} strokeWidth={1.6} />
            </div>
          }
          title="No words yet"
          body="This lesson doesn’t have any words to practise yet. Try another lesson — one with content is ready to go."
          action={
            <button className="btn btn-primary" style={{ width: 'auto', padding: '14px 26px' }} onClick={() => nav(-1)}>
              Back to lessons
            </button>
          }
        />
      </Screen>
    );
  }
  if (error || !exercises) {
    return (
      <Screen>
        <TopBar onClose={() => nav(-1)} progress={0} label="" />
        <ErrorState message="We couldn’t load this lesson. Please try again." onRetry={reload} />
      </Screen>
    );
  }

  return <LessonRunner lessonId={lessonId} exercises={exercises} />;
}

function LessonRunner({ lessonId, exercises }: { lessonId: number; exercises: ExercisePlay[] }) {
  const nav = useNavigate();
  const total = exercises.length;

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('answering');
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null); // MultipleChoice
  const [revealAnswer, setRevealAnswer] = useState<string | null>(null); // Flashcard translation
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [finished, setFinished] = useState(false);
  const [completionRecorded, setCompletionRecorded] = useState<boolean | null>(null);

  const ex = exercises[index];
  const isFlashcard = ex.type === 'Flashcard';
  const progress = useMemo(
    () => Math.round(((phase === 'revealed' ? index + 1 : index) / total) * 100),
    [index, phase, total],
  );

  function resetForNext() {
    setPhase('answering');
    setSelected(null);
    setResult(null);
    setRevealAnswer(null);
    setActionError(null);
  }

  async function checkMultipleChoice() {
    if (!selected) return;
    setBusy(true);
    setActionError(null);
    try {
      const res = await lessonsApi.checkAnswer({ wordId: ex.wordId, answer: selected });
      setResult(res);
      setPhase('revealed');
      if (res.isCorrect) setCorrectCount((c) => c + 1);
      setTotalXp((x) => x + res.xpEarned);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Could not check your answer.');
    } finally {
      setBusy(false);
    }
  }

  async function revealFlashcard() {
    setBusy(true);
    setActionError(null);
    try {
      // The exercises payload intentionally omits the correct answer, so we ask the
      // check-answer endpoint (with a non-matching answer) to reveal the translation.
      const res = await lessonsApi.checkAnswer({ wordId: ex.wordId, answer: '' });
      setRevealAnswer(res.correctAnswer);
      setPhase('revealed');
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Could not reveal the answer.');
    } finally {
      setBusy(false);
    }
  }

  async function finishLesson() {
    setBusy(true);
    try {
      // GAP: /api/lessons/complete is not wired to a controller and 404s. Treat that
      // as "not recorded" instead of a hard error so the learner still gets closure.
      await lessonsApi.complete({ lessonId, score: correctCount, totalXp });
      setCompletionRecorded(true);
    } catch (e) {
      setCompletionRecorded(!(e instanceof ApiError) ? true : false);
    } finally {
      setBusy(false);
      setFinished(true);
    }
  }

  function next() {
    if (index + 1 >= total) {
      void finishLesson();
    } else {
      setIndex((i) => i + 1);
      resetForNext();
    }
  }

  if (finished) {
    return (
      <CompletionScreen
        totalXp={totalXp}
        correct={correctCount}
        total={total}
        recorded={completionRecorded}
        onDone={() => nav('/', { replace: true })}
      />
    );
  }

  return (
    <Screen>
      <TopBar onClose={() => nav(-1)} progress={progress} label={`${index + 1}/${total}`} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isFlashcard ? (
          <Flashcard
            word={ex.question}
            revealed={phase === 'revealed'}
            answer={revealAnswer}
          />
        ) : (
          <MultipleChoice
            ex={ex}
            phase={phase}
            selected={selected}
            result={result}
            onSelect={(opt) => phase === 'answering' && setSelected(opt)}
          />
        )}
      </div>

      {actionError && <div className="notice" style={{ marginBottom: 12 }}>{actionError}</div>}

      {/* Action row / feedback sheet */}
      {phase === 'answering' ? (
        <div style={{ paddingBottom: 4 }}>
          {isFlashcard ? (
            <button className="btn btn-primary" disabled={busy} onClick={revealFlashcard}>
              {busy ? 'Revealing…' : 'Reveal answer'}
            </button>
          ) : (
            <button className="btn btn-primary" disabled={!selected || busy} onClick={checkMultipleChoice}>
              {busy ? 'Checking…' : 'Check'}
            </button>
          )}
        </div>
      ) : (
        <FeedbackSheet
          isFlashcard={isFlashcard}
          result={result}
          word={ex.question}
          revealAnswer={revealAnswer}
          busy={busy}
          onContinue={next}
        />
      )}
    </Screen>
  );
}

/* ---------- sub-components ---------- */

function TopBar({ onClose, progress, label }: { onClose: () => void; progress: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '6px 0 22px' }}>
      <button
        onClick={onClose}
        aria-label="Close lesson"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0 }}
      >
        <CloseIcon size={24} strokeWidth={2} />
      </button>
      <div className="progress" style={{ flex: 1 }}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', minWidth: 34, textAlign: 'right' }}>
        {label}
      </span>
    </div>
  );
}

function MultipleChoice({
  ex,
  phase,
  selected,
  result,
  onSelect,
}: {
  ex: ExercisePlay;
  phase: Phase;
  selected: string | null;
  result: AnswerResult | null;
  onSelect: (opt: string) => void;
}) {
  function optionClass(opt: string): string {
    if (phase === 'answering') return `option${selected === opt ? ' selected' : ''}`;
    // revealed
    const isCorrectOpt = result?.correctAnswer?.trim().toLowerCase() === opt.trim().toLowerCase();
    const isChosen = selected === opt;
    if (isCorrectOpt) return 'option correct';
    if (isChosen && !result?.isCorrect) return 'option incorrect';
    return 'option faded';
  }

  return (
    <>
      <div className="eyebrow">Choose the translation</div>
      <div style={{ fontSize: 25, lineHeight: 1.4, fontWeight: 600, marginTop: 16, letterSpacing: '-.3px' }}>
        What does <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{ex.question}</span> mean?
      </div>

      <div className="spacer" />

      <div className="stack" style={{ gap: 12, marginBottom: 20 }}>
        {ex.options.map((opt) => {
          const cls = optionClass(opt);
          const showCheck = cls.includes('correct');
          const showCross = cls.includes('incorrect');
          return (
            <button
              key={opt}
              className={cls}
              disabled={phase === 'revealed'}
              onClick={() => onSelect(opt)}
            >
              <span>{opt}</span>
              {showCheck && <CheckIcon size={22} style={{ color: 'var(--accent)' }} />}
              {showCross && <CloseIcon size={20} strokeWidth={2.2} style={{ color: 'var(--warn)' }} />}
            </button>
          );
        })}
      </div>
    </>
  );
}

function Flashcard({ word, revealed, answer }: { word: string; revealed: boolean; answer: string | null }) {
  return (
    <>
      <div className="eyebrow">Flashcard</div>
      <div className="spacer" />
      <div
        className="card"
        style={{
          borderRadius: 'var(--r-sheet)',
          boxShadow: 'var(--sh-raised)',
          padding: '40px 28px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-1px' }}>{word}</div>
        <div className="divider" style={{ margin: '22px 0' }} />
        {revealed && answer ? (
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent-ink)' }}>{answer}</div>
        ) : (
          <div className="caption">Tap “Reveal answer” to see the translation</div>
        )}
      </div>
      <div className="spacer" />
    </>
  );
}

function FeedbackSheet({
  isFlashcard,
  result,
  word,
  revealAnswer,
  busy,
  onContinue,
}: {
  isFlashcard: boolean;
  result: AnswerResult | null;
  word: string;
  revealAnswer: string | null;
  busy: boolean;
  onContinue: () => void;
}) {
  // Flashcards are self-graded (no correct/incorrect) — use the calm accent sheet.
  const correct = isFlashcard ? true : !!result?.isCorrect;
  const answer = isFlashcard ? revealAnswer : result?.correctAnswer;

  return (
    <div
      className={`sheet ${correct ? 'correct' : 'incorrect'}`}
      style={{ margin: '0 calc(-1 * var(--gutter)) -24px', paddingBottom: 30 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: correct ? 'var(--accent)' : 'var(--warn)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {correct ? (
            <CheckIcon size={18} strokeWidth={2.6} />
          ) : (
            <CloseIcon size={16} strokeWidth={2.6} />
          )}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: correct ? 'var(--accent-ink)' : 'var(--warn-ink)' }}>
            {isFlashcard ? 'Answer revealed' : correct ? 'Nicely done' : 'Not quite'}
          </div>
          <div style={{ fontSize: 13, color: correct ? 'var(--accent-soft-ink)' : '#a3672f' }}>
            {isFlashcard
              ? `${word} — ${answer ?? ''}`
              : correct
                ? `${word} — ${answer}`
                : (<>The answer is <b>{answer}</b></>)}
          </div>
        </div>
      </div>
      <button
        className={`btn ${correct ? 'btn-primary' : 'btn-warn'}`}
        style={{ marginTop: 16, padding: 17 }}
        disabled={busy}
        onClick={onContinue}
      >
        {busy ? 'Saving…' : correct ? 'Continue' : 'Got it'}
      </button>
    </div>
  );
}

function CompletionScreen({
  totalXp,
  correct,
  total,
  recorded,
  onDone,
}: {
  totalXp: number;
  correct: number;
  total: number;
  recorded: boolean | null;
  onDone: () => void;
}) {
  return (
    <Screen center>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, textAlign: 'center' }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 28,
            background: 'var(--accent-soft)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--accent)',
            boxShadow: 'var(--sh-accent-soft)',
          }}
        >
          <CheckIcon size={44} strokeWidth={2.2} />
        </div>
        <div>
          <div className="display" style={{ fontSize: 30 }}>
            Lesson complete
          </div>
          <p className="subtle" style={{ marginTop: 10, fontSize: 16 }}>
            You earned <b style={{ color: 'var(--accent-ink)' }}>{totalXp} XP</b>
            {total > 0 && ` · ${correct} correct`}
          </p>
        </div>
        {recorded === false && (
          <div className="notice" style={{ maxWidth: 300 }}>
            Your XP couldn’t be saved to your profile — the API’s
            <code> /api/lessons/complete</code> route isn’t available yet (see README).
          </div>
        )}
      </div>
      <button className="btn btn-primary" onClick={onDone} style={{ marginBottom: 8 }}>
        Done
      </button>
    </Screen>
  );
}
