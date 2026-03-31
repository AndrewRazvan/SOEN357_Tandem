import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Check, ChevronDown } from 'lucide-react';
import { useApp, type User, getUserLabel } from '../context/AppContext';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { Avatar } from '../components/ui/avatar';
import * as Slider from '@radix-ui/react-slider';

const BURDEN_LABELS: Record<number, string> = {
  1: 'Very light',
  2: 'Light',
  3: 'Fairly light',
  4: 'Moderate',
  5: 'Fairly heavy',
  6: 'Heavy',
  7: 'Very heavy',
};

export function Agreement() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { getTask, assignTask, switchUser } = useApp();

  const task = getTask(taskId!);

  const alexRating = task?.ratings.alex ?? 1;
  const jamieRating = task?.ratings.jamie ?? 1;
  const suggested = Math.round((alexRating + jamieRating) / 2);

  const [agreedBurden, setAgreedBurden] = useState(suggested);
  const [assignedTo, setAssignedTo] = useState<User>('alex');
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [confirmedBy, setConfirmedBy] = useState<{ alex: boolean; jamie: boolean }>({
    alex: false,
    jamie: false,
  });
  const [activeConfirmer, setActiveConfirmer] = useState<User>('alex');

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p style={{ color: '#8E8E93' }}>Task not found.</p>
      </div>
    );
  }

  const bothConfirmed = confirmedBy.alex && confirmedBy.jamie;
  const currentConfirmerDone = confirmedBy[activeConfirmer];

  const handleConfirm = () => {
    if (currentConfirmerDone) return;
    setConfirmedBy((prev) => ({ ...prev, [activeConfirmer]: true }));

    if (activeConfirmer === 'alex' && !confirmedBy.jamie) {
      setActiveConfirmer('jamie');
      switchUser('jamie');
    }
  };

  const handleFinish = () => {
    assignTask(taskId!, assignedTo, agreedBurden);
    switchUser('alex');
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <ScreenHeader
        title="Agree & Assign"
        subtitle="Adjust the burden score if needed, then confirm together."
        backTo={`/reveal/${taskId}`}
      />

      {/* Task chip */}
      <div className="px-5">
        <div
          className="px-3 py-2 rounded-xl inline-block"
          style={{ background: '#EFEDE8' }}
        >
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#1C1C1E' }}>
            {task.name}
          </span>
        </div>
      </div>

      {/* Burden slider */}
      <div
        className="mx-5 mt-5 rounded-2xl p-5"
        style={{ background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <p style={{ fontSize: '13px', color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Agreed Burden
          </p>
          <div className="flex items-center gap-2">
            <div
              className="px-3 py-1 rounded-full"
              style={{ background: '#EEF5F2' }}
            >
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#3D7A65' }}>
                {agreedBurden} pts
              </span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#1C1C1E', marginBottom: 16 }}>
          {BURDEN_LABELS[agreedBurden]}
        </p>

        {/* Slider */}
        <Slider.Root
          min={1}
          max={7}
          step={1}
          value={[agreedBurden]}
          onValueChange={([v]) => setAgreedBurden(v)}
          className="relative flex items-center w-full"
          style={{ height: 36 }}
        >
          <Slider.Track
            className="relative w-full rounded-full"
            style={{ height: 6, background: '#EFEDE8' }}
          >
            <Slider.Range
              className="absolute h-full rounded-full"
              style={{ background: '#7B9D8F' }}
            />
          </Slider.Track>
          <Slider.Thumb
            className="block rounded-full"
            style={{
              width: 28,
              height: 28,
              background: '#7B9D8F',
              border: '3px solid #FFFFFF',
              boxShadow: '0 2px 8px rgba(123,157,143,0.4)',
              outline: 'none',
              cursor: 'grab',
            }}
          />
        </Slider.Root>

        <div className="flex justify-between mt-2">
          <span style={{ fontSize: '11px', color: '#B0ADAA' }}>1 · Very light</span>
          <span style={{ fontSize: '11px', color: '#B0ADAA' }}>7 · Very heavy</span>
        </div>

        {/* Reference */}
        <div
          className="mt-4 flex items-center justify-between rounded-xl p-3"
          style={{ background: '#F7F5F0' }}
        >
          <div className="flex items-center gap-2">
            <Avatar user="alex" size="sm" />
            <span style={{ fontSize: '13px', color: '#8E8E93' }}>Alex rated</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C1C1E' }}>{alexRating}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '13px', color: '#8E8E93' }}>Jamie rated</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C1C1E' }}>{jamieRating}</span>
            <Avatar user="jamie" size="sm" />
          </div>
        </div>
      </div>

      {/* Assignment */}
      <div className="px-5 mt-4">
        <p style={{ fontSize: '13px', color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>
          Assign To
        </p>
        <div className="relative">
          <button
            onClick={() => setShowAssignMenu(!showAssignMenu)}
            className="w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              minHeight: 56,
            }}
          >
            <div className="flex items-center gap-3">
              <Avatar user={assignedTo} size="md" />
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1C1C1E' }}>
                {getUserLabel(assignedTo)}
              </span>
            </div>
            <ChevronDown size={18} style={{ color: '#8E8E93' }} />
          </button>

          {showAssignMenu && (
            <div
              className="absolute left-0 right-0 mt-1 rounded-2xl overflow-hidden z-10"
              style={{ background: '#FFFFFF', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            >
              {(['alex', 'jamie'] as User[]).map((u) => (
                <button
                  key={u}
                  onClick={() => { setAssignedTo(u); setShowAssignMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-4 transition-all"
                  style={{
                    background: assignedTo === u ? '#EEF5F2' : 'transparent',
                  }}
                >
                  <Avatar user={u} size="md" />
                  <span style={{ fontSize: '16px', fontWeight: assignedTo === u ? 500 : 400, color: '#1C1C1E' }}>
                    {getUserLabel(u)}
                  </span>
                  {assignedTo === u && (
                    <Check size={16} strokeWidth={2.5} style={{ color: '#7B9D8F', marginLeft: 'auto' }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dual confirmation */}
      <div className="px-5 mt-5">
        <p style={{ fontSize: '13px', color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>
          Both Confirm
        </p>
        <div className="flex gap-3">
          {(['alex', 'jamie'] as User[]).map((u) => (
            <ConfirmButton
              key={u}
              user={u}
              confirmed={confirmedBy[u]}
              isActive={activeConfirmer === u && !confirmedBy[u]}
              onConfirm={u === activeConfirmer ? handleConfirm : undefined}
            />
          ))}
        </div>
        {confirmedBy.alex && !confirmedBy.jamie && (
          <div
            className="mt-3 rounded-xl p-3"
            style={{ background: '#EBF0F7' }}
          >
            <p style={{ fontSize: '13px', color: '#3D6080', fontWeight: 500 }}>
              ✓ Alex has confirmed — now pass to Jamie to confirm.
            </p>
          </div>
        )}
      </div>

      {/* Finish button */}
      <div className="px-5 mt-auto pt-6">
        <button
          onClick={handleFinish}
          disabled={!bothConfirmed}
          className="w-full py-4 rounded-2xl transition-all active:scale-[0.98]"
          style={{
            background: bothConfirmed ? '#7B9D8F' : '#EFEDE8',
            color: bothConfirmed ? '#FFFFFF' : '#B0ADAA',
            fontSize: '16px',
            fontWeight: 500,
            minHeight: 56,
          }}
        >
          {bothConfirmed ? 'Confirm & Assign ✓' : 'Both need to confirm above'}
        </button>
      </div>
    </div>
  );
}

function ConfirmButton({
  user,
  confirmed,
  isActive,
  onConfirm,
}: {
  user: User;
  confirmed: boolean;
  isActive: boolean;
  onConfirm?: () => void;
}) {
  const name = user === 'alex' ? 'Alex' : 'Jamie';
  return (
    <button
      onClick={onConfirm}
      disabled={confirmed || !onConfirm}
      className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-[0.98]"
      style={{
        background: confirmed ? '#EEF5F2' : isActive ? '#FFFFFF' : '#F7F5F0',
        border: isActive && !confirmed ? '1.5px solid #7B9D8F' : '1.5px solid transparent',
        boxShadow: isActive && !confirmed ? '0 2px 8px rgba(123,157,143,0.15)' : 'none',
        cursor: confirmed ? 'default' : isActive ? 'pointer' : 'not-allowed',
        minHeight: 80,
      }}
    >
      <Avatar user={user} size="md" />
      <span style={{ fontSize: '14px', fontWeight: 500, color: confirmed ? '#3D7A65' : isActive ? '#1C1C1E' : '#B0ADAA' }}>
        {name}
      </span>
      {confirmed ? (
        <div className="flex items-center gap-1">
          <Check size={14} strokeWidth={2.5} style={{ color: '#3D7A65' }} />
          <span style={{ fontSize: '12px', color: '#3D7A65', fontWeight: 500 }}>Agreed</span>
        </div>
      ) : (
        <span style={{ fontSize: '12px', color: isActive ? '#7B9D8F' : '#C5C5C8' }}>
          {isActive ? 'Tap to agree' : 'Waiting…'}
        </span>
      )}
    </button>
  );
}
