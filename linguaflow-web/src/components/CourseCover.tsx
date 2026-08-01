import { useMemo } from 'react';
import type { LanguageLevel } from '../api/types';

// "A picture made of words" — abstract course cover art (design handoff CourseCover).
// Each cover is one inline SVG filled with tiny English words on a jittered 9×7 grid.
// DENSITY is the only per-level knob: A1 sparse & foggy → C2 dense deep-green, so the
// composition tells the learning story. Fully deterministic (seed = level index) so a
// cover never reflows. No images/assets beyond Hanken Grotesk (already loaded).
//
// NOTE: covers are shown as wide, short banners on the cards. We bottom-align the
// `slice` (xMidYMax) so the bottom-left level label and the densest part of the word
// field stay visible instead of being cropped out of the vertical centre.

const WORDS = [
  'go', 'eat', 'home', 'love', 'time', 'light', 'world', 'learn', 'speak', 'read',
  'grow', 'flow', 'word', 'day', 'rise', 'calm', 'near', 'true', 'open', 'mind',
  'hope', 'voice', 'warm', 'life',
];

const CREAM = '#FBFAF7';
const GREY = '#A8A399';
const GREEN = '#2F6B4E';
const INK = '#1C1B19';

const DENSITY: Record<LanguageLevel, number> = {
  A1: 0.12,
  A2: 0.24,
  B1: 0.42,
  B2: 0.6,
  C1: 0.8,
  C2: 1.0,
};
const ORDER: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const W = 300;
const H = 220;
const COLS = 9;
const ROWS = 7;

// Seeded LCG — deterministic pseudo-random (see design spec).
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface Placed {
  x: string;
  y: string;
  text: string;
  fs: string;
  fill: string;
  op: string;
  weight: number;
  rot: string;
}

function buildWords(level: LanguageLevel, density: number, dark: boolean): Placed[] {
  const rand = makeRng((Math.max(0, ORDER.indexOf(level)) + 1) * 977);
  const cellW = W / COLS;
  const cellH = H / ROWS;
  const out: Placed[] = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rand() > density) continue; // cell stays empty

      // gradient: green blooms from the bottom-left corner outward
      const grad = (c / (COLS - 1)) * 0.5 + (1 - r / (ROWS - 1)) * 0.5;
      const isGreen = grad < density;

      const word = WORDS[Math.floor(rand() * WORDS.length)];
      const jx = (rand() - 0.5) * cellW * 0.55;
      const jy = (rand() - 0.5) * cellH * 0.55;
      const x = c * cellW + cellW / 2 + jx;
      const y = r * cellH + cellH / 2 + jy;
      const fs = 7 + rand() * 4;
      const baseOp = 0.35 + density * 0.6;
      const op = Math.min(1, baseOp * (0.6 + rand() * 0.5));
      const rot = (rand() - 0.5) * 10;

      const fill = dark
        ? isGreen
          ? '#EAF2ED'
          : 'rgba(255,255,255,0.55)'
        : isGreen
          ? GREEN
          : GREY;

      out.push({
        x: x.toFixed(1),
        y: y.toFixed(1),
        text: word,
        fs: fs.toFixed(1),
        fill,
        op: op.toFixed(2),
        weight: isGreen ? 700 : 500,
        rot: rot.toFixed(1),
      });
    }
  }
  return out;
}

export function CourseCover({
  level,
  width = '100%',
  height = '100%',
  className,
  style,
}: {
  level: LanguageLevel;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const density = DENSITY[level] ?? DENSITY.A1;
  const dark = density >= 0.72; // C1/C2 are dark covers
  const bg = dark ? GREEN : CREAM;
  const words = useMemo(() => buildWords(level, density, dark), [level, density, dark]);

  const labelInk = dark ? '#FFFFFF' : INK;
  const eyebrow = dark ? 'rgba(255,255,255,0.75)' : '#8A867E';

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      style={{ display: 'block', ...style }}
      role="img"
      aria-label={`English ${level} course cover`}
    >
      {dark && (
        <defs>
          <linearGradient id={`wash-${level}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#245B41" stopOpacity="0.9" />
            <stop offset="1" stopColor="#2F6B4E" stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      <rect x={0} y={0} width={W} height={H} fill={bg} />
      {dark && <rect x={0} y={0} width={W} height={H} fill={`url(#wash-${level})`} />}
      {words.map((wd, i) => (
        <text
          key={i}
          x={wd.x}
          y={wd.y}
          fontFamily="'Hanken Grotesk', sans-serif"
          fontSize={wd.fs}
          fontWeight={wd.weight}
          fill={wd.fill}
          opacity={wd.op}
          textAnchor="middle"
          transform={`rotate(${wd.rot} ${wd.x} ${wd.y})`}
        >
          {wd.text}
        </text>
      ))}
      <text
        x={18}
        y={H - 34}
        fontFamily="'Hanken Grotesk', sans-serif"
        fontSize="10"
        fontWeight="700"
        letterSpacing="2"
        fill={eyebrow}
      >
        ENGLISH
      </text>
      <text
        x={16}
        y={H - 14}
        fontFamily="'Hanken Grotesk', sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="-1.2"
        fill={labelInk}
      >
        {level}
      </text>
    </svg>
  );
}
