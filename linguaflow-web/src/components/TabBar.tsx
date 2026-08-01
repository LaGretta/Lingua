import { useLocation, useNavigate } from 'react-router-dom';
import { CoursesIcon, HomeIcon, ProfileIcon, ReviewIcon } from './Icons';

const TABS = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/courses', label: 'Courses', Icon: CoursesIcon },
  { to: '/review', label: 'Review', Icon: ReviewIcon },
  { to: '/profile', label: 'Profile', Icon: ProfileIcon },
] as const;

export function TabBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <nav className="tabbar" aria-label="Primary">
      {TABS.map(({ to, label, Icon }) => {
        const active = isActive(to);
        return (
          <button
            key={to}
            className={`tab${active ? ' active' : ''}`}
            onClick={() => nav(to)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon strokeWidth={active ? 1.9 : 1.7} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
