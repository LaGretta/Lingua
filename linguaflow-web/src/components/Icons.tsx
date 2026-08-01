// Thin line icons (1.5–1.7px stroke), transcribed from the design reference.
// currentColor everywhere so callers control color via CSS.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number, sw: number, props: IconProps) {
  const { size: _s, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...rest,
  };
}

export const LeafIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, 1.6, p)}>
    <path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14z" />
    <path d="M6 18c2.5-5 6-8 11-9.5" />
  </svg>
);

export const HomeIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, 1.7, p)}>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 9.5V20h12V9.5" />
  </svg>
);

export const CoursesIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, 1.7, p)}>
    <rect x="4" y="5" width="16" height="6" rx="2" />
    <rect x="4" y="14" width="16" height="6" rx="2" />
  </svg>
);

export const ReviewIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, 1.7, p)}>
    <path d="M20 12a8 8 0 1 1-2.5-5.8" />
    <path d="M20 4v4h-4" />
  </svg>
);

export const ProfileIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, 1.7, p)}>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </svg>
);

export const ChevronRight = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, 2, p)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const CloseIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, 2, p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const CheckIcon = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size, 2.4, p)}>
    <path d="M5 12.5 10 17l9-10" />
  </svg>
);

export const LockIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, 1.7, p)}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
