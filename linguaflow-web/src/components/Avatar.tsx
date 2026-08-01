// Diagonal-striped placeholder avatar (per the design — real photos would replace it).
// The seed only nudges the stripe angle so different users look slightly distinct.
export function Avatar({
  seed = '',
  size = 46,
  accent = false,
}: {
  seed?: string;
  size?: number;
  accent?: boolean;
}) {
  const angle = 100 + (hash(seed) % 80); // 100–179deg
  const a = accent ? '#c7dccd' : '#E7E3DB';
  const b = accent ? '#d6e5da' : '#EFECE5';
  const step = Math.round(size / 6);
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `repeating-linear-gradient(${angle}deg, ${a} 0 ${step}px, ${b} ${step}px ${step * 2}px)`,
        border: '1px solid var(--hairline)',
        flexShrink: 0,
      }}
    />
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
