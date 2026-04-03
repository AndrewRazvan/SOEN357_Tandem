import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Lock } from 'lucide-react';
import { useApp, type User, getUserLabel } from '../context/AppContext';
import { BurdenSelector } from '../components/ui/BurdenSelector';
import { Avatar } from '../components/ui/avatar';

export function PrivateRating() {
  const { taskId, user: userParam } = useParams<{ taskId: string; user: string }>();
  const navigate = useNavigate();
  const { getTask, rateTask, switchUser } = useApp();

  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    setRating(null);
  }, [userParam]);

  const task = getTask(taskId!);
  const user = (userParam as User) || 'alex';
  const name = getUserLabel(user);

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p style={{ color: '#8E8E93' }}>Task not found.</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (rating === null) return;

    // Switch to this user for the rating
    switchUser(user);
    rateTask(taskId!, user, rating);

    if (user === 'alex') {
      // Next: Jamie rates
      navigate(`/rate/${taskId}/jamie`);
    } else {
      // Both rated → go to reveal
      navigate(`/reveal/${taskId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      {/* Profile context banner */}
      <div
        className="mx-5 mt-5 rounded-2xl p-4 flex items-center gap-3"
        style={{
          background: user === 'alex' ? '#EEF5F2' : '#EBF0F7',
        }}
      >
        <Avatar user={user} size="md" />
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: user === 'alex' ? '#3D7A65' : '#3D6080' }}>
            {name}'s turn to rate
          </p>
          <p style={{ fontSize: '12px', color: user === 'alex' ? '#5A7A6E' : '#5A6E80', fontWeight: 400 }}>
            The other person won't see your rating yet
          </p>
        </div>
        <div className="ml-auto">
          <Lock size={16} strokeWidth={2} style={{ color: user === 'alex' ? '#3D7A65' : '#3D6080' }} />
        </div>
      </div>

      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <h1 style={{ color: '#1C1C1E', letterSpacing: '-0.5px' }}>
          How burdensome does this feel?
        </h1>
        <div
          className="mt-3 px-3 py-2 rounded-xl inline-block"
          style={{ background: '#EFEDE8' }}
        >
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#1C1C1E' }}>
            {task.name}
          </span>
        </div>
        {task.description && (
          <p className="mt-2" style={{ fontSize: '14px', color: '#8E8E93' }}>
            {task.description}
          </p>
        )}
      </div>

      {/* Rating selector */}
      <div className="px-5 mt-6">
        <BurdenSelector value={rating} onChange={setRating} />
      </div>

      {/* Private reassurance */}
      <div className="px-5 mt-6">
        <div
          className="rounded-2xl p-4 flex gap-3 items-start"
          style={{ background: '#F5F3EE' }}
        >
          <Lock size={16} strokeWidth={2} style={{ color: '#B0ADAA', marginTop: 2 }} />
          <p style={{ fontSize: '13px', color: '#8E8E93', fontWeight: 400 }}>
            Only you can see this rating right now. Both ratings will be revealed at the same time on the next step.
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 mt-auto pt-8">
        <button
          onClick={handleSubmit}
          disabled={rating === null}
          className="w-full py-4 rounded-2xl transition-all active:scale-[0.98]"
          style={{
            background: rating !== null ? '#7B9D8F' : '#EFEDE8',
            color: rating !== null ? '#FFFFFF' : '#B0ADAA',
            fontSize: '16px',
            fontWeight: 500,
            minHeight: 56,
          }}
        >
          {rating !== null ? 'Submit My Rating' : 'Select a rating above'}
        </button>
        <p className="text-center mt-3" style={{ fontSize: '13px', color: '#8E8E93' }}>
          {user === 'alex'
            ? `${getUserLabel('jamie')} will rate next — privately.`
            : "Both ratings will be revealed together."}
        </p>
      </div>
    </div>
  );
}
