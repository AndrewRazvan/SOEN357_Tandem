import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import { getUserLabel, getUserPathSegment, useApp, type Task } from '../context/AppContext';
import { ContributionBar } from '../components/ui/ContributionBar';
import { TaskCard } from '../components/ui/TaskCard';
import { ProfileSwitcher } from '../components/ui/ProfileSwitcher';

/**
 * Dashboard: a single home screen that groups tasks by state and provides
 * the next action for anything currently in the negotiation flow.
 */
export function Dashboard() {
  const { tasks, currentUser, switchUser } = useApp();
  const navigate = useNavigate();

  // “Pending” = agreed + assigned, but not marked complete yet.
  const pending = tasks.filter((t) => t.status === 'assigned');
  const complete = tasks.filter((t) => t.status === 'complete');

  // Tasks still in the negotiation flow
  const inProgress = tasks.filter(
    (t) => ['rating-alex', 'rating-jamie', 'reveal', 'agreement'].includes(t.status)
  );

  return (
    <div className="flex flex-col pb-10">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span style={{ fontSize: '22px', fontWeight: 600, color: '#1C1C1E', letterSpacing: '-0.5px' }}>
              Tandem
            </span>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ background: '#D4E5DE', color: '#3D7A65', fontSize: '11px', fontWeight: 500 }}
            >
              Home
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#8E8E93', fontWeight: 400 }}>
            Where Effort Meets Agreement
          </p>
        </div>
        <ProfileSwitcher currentUser={currentUser} onSwitch={switchUser} />
      </div>

      {/* Contribution bar */}
      <ContributionBar tasks={tasks} />

      {/* Add task CTA */}
      <div className="px-5 mt-5">
        <button
          onClick={() => navigate('/create')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl transition-all active:scale-[0.98]"
          style={{ background: '#7B9D8F', minHeight: 56 }}
        >
          <Plus size={18} strokeWidth={2.5} color="#FFFFFF" />
          <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 500 }}>
            Add Task
          </span>
        </button>
      </div>

      {/* In Progress tasks */}
      {inProgress.length > 0 && (
        <div className="mt-6 px-5">
          <SectionLabel label="In Negotiation" count={inProgress.length} accent />
          <div className="flex flex-col gap-2 mt-3">
            {inProgress.map((task) => (
              <InProgressCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Pending tasks */}
      {pending.length > 0 && (
        <div className="mt-6 px-5">
          <SectionLabel label="Pending" count={pending.length} />
          <div className="flex flex-col gap-2 mt-3">
            {pending.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Complete tasks */}
      {complete.length > 0 && (
        <div className="mt-6 px-5">
          <SectionLabel label="Completed" count={complete.length} />
          <div className="flex flex-col gap-2 mt-3">
            {complete.slice(0, 5).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 px-10 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: '#EEF5F2' }}
          >
            <Plus size={28} style={{ color: '#7B9D8F' }} />
          </div>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#1C1C1E' }}>
            Nothing here yet
          </p>
          <p className="mt-1" style={{ fontSize: '14px', color: '#8E8E93' }}>
            Add your first shared task to start the conversation.
          </p>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ label, count, accent }: { label: string; count: number; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
        {label}
      </span>
      <span
        className="px-1.5 py-0.5 rounded-full"
        style={{
          background: accent ? '#D4E5DE' : '#EFEDE8',
          color: accent ? '#3D7A65' : '#8E8E93',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    </div>
  );
}

function InProgressCard({ task }: { task: Task }) {
  const navigate = useNavigate();
  const alexName = getUserLabel('alex');
  const jamieName = getUserLabel('jamie');

  // Map a task's state to the next “resume the flow” action.
  const statusMap: Record<string, { label: string; action: string; path: string }> = {
    'rating-alex': {
      label: `Waiting for ${alexName}'s rating`,
      action: 'Rate now',
      path: `/rate/${task.id}/${getUserPathSegment('alex')}`,
    },
    'rating-jamie': {
      label: `Waiting for ${jamieName}'s rating`,
      action: 'Rate now',
      path: `/rate/${task.id}/${getUserPathSegment('jamie')}`,
    },
    'reveal': {
      label: 'Ratings ready to reveal',
      action: 'See reveal',
      path: `/reveal/${task.id}`,
    },
    'agreement': {
      label: 'Needs agreement',
      action: 'Agree & assign',
      path: `/agree/${task.id}`,
    },
  };

  const info = statusMap[task.status];
  if (!info) return null;

  return (
    <button
      onClick={() => navigate(info.path)}
      className="w-full text-left rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #D4E5DE',
        boxShadow: '0 2px 8px rgba(123,157,143,0.1)',
      }}
    >
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: '#7B9D8F' }}
      />
      <div className="flex-1 min-w-0">
        <div className="truncate" style={{ fontSize: '15px', fontWeight: 500, color: '#1C1C1E' }}>
          {task.name}
        </div>
        <div style={{ fontSize: '12px', color: '#8E8E93', marginTop: 2 }}>{info.label}</div>
      </div>
      <span
        className="shrink-0 px-3 py-1.5 rounded-full"
        style={{ background: '#EEF5F2', color: '#3D7A65', fontSize: '13px', fontWeight: 500 }}
      >
        {info.action}
      </span>
    </button>
  );
}
