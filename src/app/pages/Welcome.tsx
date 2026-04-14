import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Eye, Sliders, LayoutDashboard, Users } from 'lucide-react';

type Phase = 'writing' | 'explain' | 'names';

const FEATURES = [
  { icon: Eye, title: 'Rate privately', description: 'No anchoring — each person rates burden on their own.' },
  { icon: Sliders, title: 'Reveal & agree', description: 'Ratings surface simultaneously. Negotiate a shared score.' },
  { icon: LayoutDashboard, title: 'Track fairness', description: 'See agreed vs. completed burden for both people.' },
];

const GREEN_BG = 'linear-gradient(160deg, #D9EDE6 0%, #F7F5F0 60%)';
const ACCENT_BAR = 'linear-gradient(90deg, #4E7D6F, #2E7A28)';

/**
 * Onboarding: a tiny multi-phase intro (story → explanation → names).
 * Persists a "welcomed" flag + display names in localStorage.
 */
export function Welcome() {
  const [phase, setPhase] = useState<Phase>('writing');
  const navigate = useNavigate();

  const handleGetStarted = (names: { alex: string; jamie: string }) => {
    // Names are purely UI labels; core state still uses the stable user IDs.
    localStorage.setItem('tandem_user_names', JSON.stringify(names));
    localStorage.setItem('tandem_welcomed', '1');
    navigate('/');
  };

  if (phase === 'names') return <NamesPhase onGetStarted={handleGetStarted} />;
  if (phase === 'explain') return <ExplainPhase onNext={() => setPhase('names')} />;
  return <WritingPhase onNext={() => setPhase('explain')} />;
}

/* ─── Shared accent bar ─────────────────────────────────────────────── */

function AccentBar({ mb = 6 }: { mb?: number }) {
  return (
    <div
      className="w-10 h-1 rounded-full"
      style={{ background: ACCENT_BAR, marginBottom: mb * 4 }}
    />
  );
}

/* ─── Writing phase ─────────────────────────────────────────────────── */

function WritingPhase({ onNext }: { onNext: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-full px-8"
      style={{ background: GREEN_BG }}
    >
      <AccentBar mb={14} />

      <div className="text-center mb-20">
        <div
          className="cursive-line-1"
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: '34px',
            fontWeight: 600,
            color: '#4E7D6F',
            marginBottom: 6,
            display: 'block',
          }}
        >
          Welcome to
        </div>
        <div
          className="cursive-line-2"
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: '80px',
            fontWeight: 700,
            color: '#2C6352',
            letterSpacing: '-1.5px',
            lineHeight: 1.05,
            display: 'block',
          }}
        >
          Tandem
        </div>
      </div>

      <button
        onClick={onNext}
        className="cursive-button flex items-center gap-2 px-8 py-4 rounded-2xl transition-all active:scale-[0.97]"
        style={{ background: '#4E7D6F', color: '#FFFFFF', fontSize: '17px', fontWeight: 500 }}
      >
        See how it works
        <ArrowRight size={18} strokeWidth={2} />
      </button>

      <style>{`
        .cursive-line-1 {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
          animation: write-line 2.4s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
        }
        .cursive-line-2 {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
          animation: write-line 2.8s cubic-bezier(0.4, 0, 0.2, 1) 3.0s forwards;
        }
        .cursive-button {
          opacity: 0;
          transform: translateY(10px);
          animation: fade-up 1.0s ease 5.8s forwards;
        }
        @keyframes write-line {
          0%   { opacity: 1; clip-path: inset(0 100% 0 0); }
          100% { opacity: 1; clip-path: inset(0 0%   0 0); }
        }
        @keyframes fade-up {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Explain phase ─────────────────────────────────────────────────── */

function ExplainPhase({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-full pb-10 px-5 pt-8" style={{ background: GREEN_BG }}>
      <AccentBar mb={6} />

      <div
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: '44px',
          fontWeight: 700,
          color: '#2C6352',
          lineHeight: 1.1,
          marginBottom: 8,
        }}
      >
        What is Tandem?
      </div>
      <p style={{ fontSize: '15px', color: '#3D6A5C', lineHeight: 1.6, marginBottom: 28 }}>
        A tool for couples and roommates to negotiate household tasks — fairly, privately, and together.
      </p>

      <div className="flex flex-col gap-3 mb-auto">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-start gap-4 rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.75)', boxShadow: '0 1px 4px rgba(44,99,82,0.1)' }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{ width: 38, height: 38, background: '#D9EDE6' }}
            >
              <Icon size={17} strokeWidth={1.8} style={{ color: '#4E7D6F' }} />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C6352', marginBottom: 2 }}>{title}</p>
              <p style={{ fontSize: '14px', color: '#3D6A5C', lineHeight: 1.5 }}>{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          style={{ background: '#4E7D6F', color: '#FFFFFF', fontSize: '17px', fontWeight: 500, minHeight: 56 }}
        >
          Next
          <ArrowRight size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/* ─── Names phase ───────────────────────────────────────────────────── */

function NamesPhase({ onGetStarted }: { onGetStarted: (names: { alex: string; jamie: string }) => void }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');

  const canContinue = name1.trim().length > 0 && name2.trim().length > 0;

  return (
    <div className="flex flex-col min-h-full pb-10 px-5 pt-8" style={{ background: GREEN_BG }}>
      <AccentBar mb={6} />

      <div
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: '44px',
          fontWeight: 700,
          color: '#2C6352',
          lineHeight: 1.1,
          marginBottom: 8,
        }}
      >
        Who's using Tandem?
      </div>
      <p style={{ fontSize: '15px', color: '#3D6A5C', lineHeight: 1.6, marginBottom: 32 }}>
        Enter both names so the app can tell you apart.
      </p>

      <div className="flex flex-col gap-4 mb-auto">
        {/* Person 1 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} strokeWidth={2} style={{ color: '#4E7D6F' }} />
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#4E7D6F', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Person 1
            </p>
          </div>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="e.g. Alex"
            maxLength={20}
            className="w-full px-4 py-4 rounded-2xl outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1.5px solid',
              borderColor: name1 ? '#4E7D6F' : 'rgba(78,125,111,0.2)',
              fontSize: '16px',
              color: '#1C1C1E',
              boxShadow: name1 ? '0 0 0 3px rgba(78,125,111,0.12)' : 'none',
            }}
          />
        </div>

        {/* Person 2 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} strokeWidth={2} style={{ color: '#4E7D6F' }} />
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#4E7D6F', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Person 2
            </p>
          </div>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="e.g. Jamie"
            maxLength={20}
            className="w-full px-4 py-4 rounded-2xl outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1.5px solid',
              borderColor: name2 ? '#4E7D6F' : 'rgba(78,125,111,0.2)',
              fontSize: '16px',
              color: '#1C1C1E',
              boxShadow: name2 ? '0 0 0 3px rgba(78,125,111,0.12)' : 'none',
            }}
          />
        </div>
      </div>

      <div className="pt-8">
        <button
          onClick={() => onGetStarted({ alex: name1.trim(), jamie: name2.trim() })}
          disabled={!canContinue}
          className="w-full py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: canContinue ? '#4E7D6F' : 'rgba(78,125,111,0.25)',
            color: canContinue ? '#FFFFFF' : 'rgba(44,99,82,0.4)',
            fontSize: '17px',
            fontWeight: 500,
            minHeight: 56,
          }}
        >
          Get Started
          <ArrowRight size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
