import type { ReactNode } from 'react';

// Calm loading / empty / error states so the app never shows a blank screen.

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div style={centerBox}>
      <div className="lf-spinner" aria-hidden />
      <div className="caption" role="status">
        {label}
      </div>
      <style>{spinnerCss}</style>
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="stack" style={{ gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="lf-skel" style={{ height: 92 }} />
      ))}
      <style>{skeletonCss}</style>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div style={centerBox}>
      {icon}
      <div className="title" style={{ fontSize: 22 }}>
        {title}
      </div>
      {body && (
        <p className="subtle" style={{ maxWidth: 260, margin: 0, lineHeight: 1.55 }}>
          {body}
        </p>
      )}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={centerBox}>
      <div className="title" style={{ fontSize: 22 }}>
        Something went wrong
      </div>
      <p className="subtle" style={{ maxWidth: 280, margin: 0, lineHeight: 1.55 }}>
        {message}
      </p>
      {onRetry && (
        <button className="btn btn-secondary" style={{ width: 'auto', padding: '12px 22px' }} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

const centerBox: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: 14,
  padding: '40px 0',
};

const spinnerCss = `
.lf-spinner{width:34px;height:34px;border-radius:50%;
  border:3px solid var(--disabled-bg);border-top-color:var(--accent);
  animation:lf-spin .8s linear infinite}
@keyframes lf-spin{to{transform:rotate(360deg)}}`;

const skeletonCss = `
.lf-skel{border-radius:var(--r-card);
  background:repeating-linear-gradient(135deg,#efede7 0 13px,#f5f3ee 13px 26px);
  border:1px solid var(--hairline);
  animation:lf-pulse 1.4s ease-in-out infinite}
@keyframes lf-pulse{0%,100%{opacity:1}50%{opacity:.6}}`;
