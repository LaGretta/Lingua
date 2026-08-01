import type { ReactNode } from 'react';
import { TabBar } from './TabBar';

// Shared screen chrome: the scrollable content region and (optionally) the bottom
// tab bar. On mobile/standalone the device's own status bar is shown, so there's no
// fake one here; top spacing respects the safe-area inset (notch) via CSS.
export function Screen({
  children,
  tabbar = false,
  center = false,
}: {
  children: ReactNode;
  tabbar?: boolean;
  center?: boolean;
}) {
  return (
    <>
      <div className={`screen${tabbar ? ' has-tabbar' : ''}${center ? ' center' : ''}`}>
        {children}
      </div>
      {tabbar && <TabBar />}
    </>
  );
}
