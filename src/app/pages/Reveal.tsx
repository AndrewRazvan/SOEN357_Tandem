import { useNavigate, useParams } from 'react-router';
import { useApp, getUserLabel } from '../context/AppContext';
import { Avatar } from '../components/ui/avatar';
import { ScreenHeader } from '../components/ui/ScreenHeader';

const BURDEN_LABELS: Record<number, string> = {
  1: 'Very light',
  2: 'Light',
  3: 'Fairly light',
  4: 'Moderate',
  5: 'Fairly heavy',
  6: 'Heavy',
  7: 'Very heavy',
};

function RatingDot({ value, total = 7 }: { value: number; total?: number }) {
  return (
    <div className="flex gap-1 justify-center mt-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: i < value ? 8 : 6,
            height: i < value ? 8 : 6,
            background: i < value ? '#7B9D8F' : '#EFEDE8',
          }}
        />
      ))}
    </div>
  );
}

export function Reveal() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { getTask, updateTaskStatus } = useApp();

  const task = getTask(taskId!);

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p style={{ color: '#8E8E93' }}>Task not found.</p>
      </div>
    );
  }

  const alexRating = task.ratings.alex ?? 0;
  const jamieRating = task.ratings.jamie ?? 0;
  const diff = Math.abs(alexRating - jamieRating);
  // “Aligned” is intentionally generous so close ratings feel like a quick win.
  const aligned = diff <= 1;

  const handleContinue = () => {
    // Move the task along to the agreement/assignment step.
    updateTaskStatus(taskId!, 'agreement');
    navigate(`/agree/${taskId}`);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <ScreenHeader
        title="Here's how you each felt"
        subtitle="Both ratings revealed at the same time — no surprises."
        backTo="/"
      />

      {/* Task name chip */}
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

      {/* Side-by-side ratings */}
      <div className="px-5 mt-6 flex gap-4">
        <RatingCard user="alex" rating={alexRating} />
        <RatingCard user="jamie" rating={jamieRating} />
      </div>

      {/* Alignment callout */}
      <div className="px-5 mt-5">
        <div
          className="rounded-2xl p-4"
          style={{
            background: aligned ? '#EEF5F2' : '#F0EDE8',
            border: aligned ? '1.5px solid #C8DED8' : '1.5px solid #DDD9D0',
          }}
        >
          <p
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: aligned ? '#3D7A65' : '#6B5E4E',
            }}
          >
            {aligned
              ? "You're already aligned ✓"
              : 'You saw this differently — let\'s find common ground'}
          </p>
          <p
            className="mt-1"
            style={{ fontSize: '13px', color: aligned ? '#5A7A6E' : '#8A7060', fontWeight: 400 }}
          >
            {aligned
              ? 'Your ratings are very close. The next step is quick.'
              : `There's a ${diff}-point difference. That's okay — the next step helps you land on a shared number.`}
          </p>
        </div>
      </div>

      {/* Midpoint preview */}
      <div className="px-5 mt-4">
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <div>
            <p style={{ fontSize: '13px', color: '#8E8E93' }}>Suggested starting point</p>
            <p style={{ fontSize: '22px', fontWeight: 600, color: '#1C1C1E', letterSpacing: '-0.5px' }}>
              {Math.round((alexRating + jamieRating) / 2)} pts
            </p>
            <p style={{ fontSize: '13px', color: '#8E8E93' }}>
              {BURDEN_LABELS[Math.round((alexRating + jamieRating) / 2)]}
            </p>
          </div>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#EEF5F2' }}
          >
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#7B9D8F' }}>
              {Math.round((alexRating + jamieRating) / 2)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 mt-auto pt-8">
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl transition-all active:scale-[0.98]"
          style={{ background: '#7B9D8F', color: '#FFFFFF', fontSize: '16px', fontWeight: 500, minHeight: 56 }}
        >
          Find Common Ground →
        </button>
      </div>
    </div>
  );
}

function RatingCard({ user, rating }: { user: 'alex' | 'jamie'; rating: number }) {
  const name = getUserLabel(user);
  return (
    <div
      className="flex-1 rounded-2xl p-4 flex flex-col items-center"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
      }}
    >
      <Avatar user={user} size="lg" />
      <p
        className="mt-2"
        style={{ fontSize: '14px', fontWeight: 500, color: '#1C1C1E' }}
      >
        {name}
      </p>
      <div
        className="mt-3 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: user === 'alex' ? '#EEF5F2' : '#EBF0F7',
        }}
      >
        <span
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: user === 'alex' ? '#3D7A65' : '#3D6080',
          }}
        >
          {rating}
        </span>
      </div>
      <RatingDot value={rating} />
      <p
        className="mt-2 text-center"
        style={{ fontSize: '12px', color: '#8E8E93' }}
      >
        {BURDEN_LABELS[rating] || '—'}
      </p>
    </div>
  );
}
