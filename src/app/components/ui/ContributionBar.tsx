import type { Task, User } from '../../context/AppContext';
import { Avatar } from './avatar';

interface ContributionBarProps {
  tasks: Task[];
}

function getStats(tasks: Task[], user: User) {
  const assigned = tasks.filter(
    (t) => t.assignedTo === user && (t.status === 'assigned' || t.status === 'complete')
  );
  const total = assigned.reduce((sum, t) => sum + (t.agreedBurden ?? 0), 0);
  const completed = assigned
    .filter((t) => t.status === 'complete')
    .reduce((sum, t) => sum + (t.agreedBurden ?? 0), 0);
  return { total, completed, pending: total - completed };
}

function getBalanceStatus(alexStats: ReturnType<typeof getStats>, jamieStats: ReturnType<typeof getStats>): {
  label: string;
  balanced: boolean;
} {
  const alexRate = alexStats.total > 0 ? alexStats.completed / alexStats.total : 0;
  const jamieRate = jamieStats.total > 0 ? jamieStats.completed / jamieStats.total : 0;
  const diff = Math.abs(alexRate - jamieRate);
  const pendingDiff = Math.abs(alexStats.pending - jamieStats.pending);

  if (diff < 0.18 && pendingDiff <= 2) {
    return { label: 'Things look balanced ✓', balanced: true };
  }
  const higherPending = alexStats.pending > jamieStats.pending ? 'Alex' : 'Jamie';
  return {
    label: `${higherPending} could use a few more tasks to even things out`,
    balanced: false,
  };
}

export function ContributionBar({ tasks }: ContributionBarProps) {
  const alexStats = getStats(tasks, 'alex');
  const jamieStats = getStats(tasks, 'jamie');
  const grand = alexStats.total + jamieStats.total;
  const alexPct = grand > 0 ? (alexStats.total / grand) * 100 : 50;
  const jamie = getBalanceStatus(alexStats, jamieStats);

  return (
    <div
      className="rounded-2xl p-5 mx-5"
      style={{ background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}
    >
      {/* Balance badge */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="px-3 py-1 rounded-full"
          style={{
            background: jamie.balanced ? '#EEF5F2' : '#F0EDE8',
            color: jamie.balanced ? '#3D7A65' : '#6B5E4E',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {jamie.label}
        </div>
      </div>

      {/* Segmented bar */}
      <div className="h-3 rounded-full overflow-hidden flex mb-4" style={{ background: '#EFEDE8' }}>
        <div
          className="h-full rounded-l-full transition-all duration-500"
          style={{ width: `${alexPct}%`, background: '#A8C5BA' }}
        />
        <div
          className="h-full rounded-r-full flex-1"
          style={{ background: '#9AB0C8' }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-stretch gap-3">
        <UserStat user="alex" stats={alexStats} />
        <div className="w-px" style={{ background: '#EFEDE8' }} />
        <UserStat user="jamie" stats={jamieStats} />
      </div>
    </div>
  );
}

function UserStat({ user, stats }: { user: User; stats: { total: number; completed: number; pending: number } }) {
  const name = user === 'alex' ? 'Alex' : 'Jamie';
  return (
    <div className="flex-1 flex items-center gap-2.5">
      <Avatar user={user} size="sm" />
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1E' }}>{name}</div>
        <div style={{ fontSize: '12px', color: '#8E8E93', fontWeight: 400 }}>
          {stats.completed}/{stats.total} pts done
        </div>
      </div>
    </div>
  );
}
