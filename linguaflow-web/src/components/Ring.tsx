import type { ReactNode } from 'react';

// Conic-gradient progress ring matching the design (level ring / course progress).
export function Ring({
  percent,
  size = 56,
  thickness = 7,
  children,
}: {
  percent: number; // 0–100
  size?: number;
  thickness?: number;
  children?: ReactNode;
}) {
  const p = Math.max(0, Math.min(100, percent));
  const inner = size - thickness * 2;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `conic-gradient(var(--accent) ${p}%, var(--ring-track) 0)`,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          borderRadius: '50%',
          background: 'var(--surface)',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
