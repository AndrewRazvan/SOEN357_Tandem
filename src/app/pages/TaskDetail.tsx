import { useParams } from 'react-router';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { useApp, getUserLabel } from '../context/AppContext';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { Avatar } from '../components/ui/avatar';

const BURDEN_LABELS: Record<number, string> = {
  1: 'Very light',
  2: 'Light',
  3: 'Fairly light',
  4: 'Moderate',
  5: 'Fairly heavy',
  6: 'Heavy',
  7: 'Very heavy',
};

function BurdenBar({ value }: { value: number }) {
  return (
    <div className="flex gap-1.5 mt-2">
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <div
          key={n}
          className="flex-1 h-2 rounded-full"
          style={{ background: n <= value ? '#7B9D8F' : '#EFEDE8' }}
        />
      ))}
    </div>
  );
}

/**
 * Task detail page: shows the agreed outcome (burden + assignment) and lets
 * the assigned person mark the task complete.
 */
export function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTask, completeTask, currentUser } = useApp();

  const task = getTask(taskId!);

  if (!task) {
    return (
      <div className="flex flex-col min-h-full">
        <ScreenHeader title="Task" backTo="/" />
        <div className="flex items-center justify-center flex-1">
          <p style={{ color: '#8E8E93' }}>Task not found.</p>
        </div>
      </div>
    );
  }

  // Only the assignee can complete the task (mirrors the “ownership” model).
  const isAssignedToCurrentUser = task.assignedTo === currentUser;
  const isComplete = task.status === 'complete';
  const canComplete = isAssignedToCurrentUser && !isComplete;

  const handleComplete = () => {
    completeTask(taskId!);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <ScreenHeader
        title={task.name}
        backTo="/"
      />

      {/* Description */}
      {task.description && (
        <div className="px-5 mb-5">
          <p style={{ fontSize: '15px', color: '#5C5C60', fontWeight: 400 }}>{task.description}</p>
        </div>
      )}

      {/* Status banner */}
      {isComplete && (
        <div
          className="mx-5 mb-5 rounded-2xl p-4 flex items-center gap-3"
          style={{ background: '#EEF5F2' }}
        >
          <CheckCircle2 size={20} strokeWidth={2} style={{ color: '#7B9D8F' }} />
          <p style={{ fontSize: '15px', fontWeight: 500, color: '#3D7A65' }}>
            This task is complete
          </p>
        </div>
      )}

      {/* Main info card */}
      <div
        className="mx-5 rounded-2xl overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}
      >
        {/* Agreed burden */}
        <div className="p-5 border-b" style={{ borderColor: '#F0EDE8' }}>
          <p style={{ fontSize: '12px', color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Agreed Burden
          </p>
          <div className="flex items-end justify-between mt-1">
            <div>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#1C1C1E', letterSpacing: '-1px' }}>
                {task.agreedBurden ?? '—'}
              </span>
              <span style={{ fontSize: '15px', color: '#8E8E93', marginLeft: 4 }}>/ 7</span>
            </div>
            <span
              className="px-3 py-1 rounded-full"
              style={{ background: '#EEF5F2', color: '#3D7A65', fontSize: '13px', fontWeight: 500 }}
            >
              {task.agreedBurden ? BURDEN_LABELS[task.agreedBurden] : '—'}
            </span>
          </div>
          {task.agreedBurden && <BurdenBar value={task.agreedBurden} />}
        </div>

        {/* Assigned to */}
        <div className="p-5 border-b" style={{ borderColor: '#F0EDE8' }}>
          <p style={{ fontSize: '12px', color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>
            Assigned To
          </p>
          {task.assignedTo ? (
            <div className="flex items-center gap-3">
              <Avatar user={task.assignedTo} size="lg" />
              <div>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#1C1C1E' }}>
                  {getUserLabel(task.assignedTo!)}
                </p>
                {task.assignedTo === currentUser && (
                  <p style={{ fontSize: '13px', color: '#7B9D8F' }}>That's you</p>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: '#8E8E93' }}>Not yet assigned</p>
          )}
        </div>

        {/* Private ratings footnote */}
        {(task.ratings.alex !== undefined || task.ratings.jamie !== undefined) && (
          <div className="p-5">
            <div className="flex items-center gap-1.5 mb-3">
              <Lock size={13} strokeWidth={2} style={{ color: '#B0ADAA' }} />
              <p style={{ fontSize: '12px', color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Original Private Ratings
              </p>
            </div>
            <div className="flex gap-4">
              {task.ratings.alex !== undefined && (
                <RatingPill user="alex" rating={task.ratings.alex} />
              )}
              {task.ratings.jamie !== undefined && (
                <RatingPill user="jamie" rating={task.ratings.jamie} />
              )}
            </div>
            <p className="mt-3" style={{ fontSize: '12px', color: '#B0ADAA' }}>
              Shown for transparency after both parties agreed.
            </p>
          </div>
        )}
      </div>

      {/* Completion toggle */}
      <div className="px-5 mt-5">
        {canComplete ? (
          <button
            onClick={handleComplete}
            className="w-full flex items-center gap-3 py-4 px-5 rounded-2xl transition-all active:scale-[0.98]"
            style={{ background: '#7B9D8F', minHeight: 56 }}
          >
            <Circle size={20} strokeWidth={2} color="rgba(255,255,255,0.7)" />
            <span style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 500 }}>
              Mark as Complete
            </span>
          </button>
        ) : isComplete ? (
          <div
            className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-2xl"
            style={{ background: '#EEF5F2', minHeight: 56 }}
          >
            <CheckCircle2 size={20} strokeWidth={2} style={{ color: '#7B9D8F' }} />
            <span style={{ color: '#3D7A65', fontSize: '16px', fontWeight: 500 }}>
              Done!
            </span>
          </div>
        ) : (
          <div
            className="w-full flex flex-col items-center gap-1 py-4 px-5 rounded-2xl"
            style={{ background: '#F5F3EE', minHeight: 56 }}
          >
            <div className="flex items-center gap-2">
              <Lock size={16} strokeWidth={2} style={{ color: '#B0ADAA' }} />
              <span style={{ color: '#8E8E93', fontSize: '15px', fontWeight: 500 }}>
                Only {getUserLabel(task.assignedTo!)} can mark this done
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#B0ADAA' }}>
              Switch profile to complete this task.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingPill({ user, rating }: { user: 'alex' | 'jamie'; rating: number }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{ background: '#F7F5F0' }}
    >
      <Avatar user={user} size="sm" />
      <div>
        <span style={{ fontSize: '13px', color: '#8E8E93' }}>
          {getUserLabel(user)}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C1C1E', marginLeft: 6 }}>
          {rating}
        </span>
      </div>
    </div>
  );
}
