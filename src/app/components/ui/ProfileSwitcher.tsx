import { type User, getUserLabel } from '../../context/AppContext';
import { Avatar } from './avatar';

interface ProfileSwitcherProps {
  currentUser: User;
  onSwitch: (user: User) => void;
}

export function ProfileSwitcher({ currentUser, onSwitch }: ProfileSwitcherProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-full p-1"
      style={{ background: '#EFEDE8' }}
    >
      {(['alex', 'jamie'] as User[]).map((user) => {
        const active = user === currentUser;
        return (
          <button
            key={user}
            onClick={() => onSwitch(user)}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-200"
            style={{
              background: active ? '#FFFFFF' : 'transparent',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              minHeight: 36,
            }}
          >
            <Avatar user={user} size="sm" />
            <span
              style={{
                fontSize: '14px',
                fontWeight: active ? 500 : 400,
                color: active ? '#1C1C1E' : '#8E8E93',
              }}
            >
              {getUserLabel(user)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
