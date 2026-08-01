import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { LeafIcon } from '../components/Icons';

export function Onboarding() {
  const nav = useNavigate();
  return (
    <Screen center>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 30,
            background: 'var(--accent-soft)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 18px 40px -18px rgba(47,107,78,.5)',
          }}
        >
          <LeafIcon size={46} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
        </div>
        <div>
          <div className="display">LinguaFlow</div>
          <p className="subtle" style={{ fontSize: 16, lineHeight: 1.55, margin: '14px auto 0', maxWidth: 260 }}>
            A calmer, more beautiful way to reach English fluency — a few quiet minutes a day.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', paddingBottom: 8 }}>
        <button className="btn btn-primary" onClick={() => nav('/register')}>
          Get started
        </button>
        <div className="subtle" style={{ fontSize: 15 }}>
          Already learning? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </Screen>
  );
}
