import { useNavigate } from 'react-router';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { type Task } from '../../context/AppContext';
import { Avatar } from './avatar';

interface TaskCardProps {
  task: Task;
}

const burdenLabel = (n: number) => {
  if (n <= 2) return 'Light';
  if (n <= 4) return 'Moderate';
  return 'Heavy';
};

const burdenDot = (n: number) => {
  if (n <= 2) return '#A8C5BA';
  if (n <= 4) return '#9AB0C8';
  return '#B8A8C5';
};

export function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();
  const isComplete = task.status === 'complete';

  const handleClick = () => {
    navigate(`/task/${task.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]"
      style={{
        background: isComplete ? '#FAFAF8' : '#FFFFFF',
        boxShadow: isComplete
          ? 'none'
          : '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        border: isComplete ? '1px solid #EFEDE8' : '1px solid transparent',
        opacity: isComplete ? 0.75 : 1,
      }}
    >
      {/* Status icon */}
      <div className="shrink-0">
        {isComplete ? (
          <CheckCircle2 size={22} strokeWidth={1.8} style={{ color: '#A8C5BA' }} />
        ) : (
          <Circle size={22} strokeWidth={1.8} style={{ color: '#C5C5C8' }} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className="truncate"
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: isComplete ? '#8E8E93' : '#1C1C1E',
            textDecoration: isComplete ? 'line-through' : 'none',
          }}
        >
          {task.name}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {task.agreedBurden != null && (
            <span
              className="flex items-center gap-1"
              style={{ fontSize: '12px', color: '#8E8E93' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: burdenDot(task.agreedBurden) }}
              />
              {burdenLabel(task.agreedBurden)} · {task.agreedBurden} pts
            </span>
          )}
        </div>
      </div>

      {/* Assignee + chevron */}
      <div className="flex items-center gap-2 shrink-0">
        {task.assignedTo && <Avatar user={task.assignedTo} size="sm" />}
        <ChevronRight size={16} strokeWidth={2} style={{ color: '#C5C5C8' }} />
      </div>
    </button>
  );
}
