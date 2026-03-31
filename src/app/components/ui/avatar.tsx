import type { User } from '../../context/AppContext';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 28,
  md: 36,
  lg: 44,
};

const colorMap: Record<User, { bg: string; text: string }> = {
  alex: { bg: '#D4E5DE', text: '#3D7A65' },
  jamie: { bg: '#D0DAE8', text: '#3D6080' },
};

export function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
  const px = sizeMap[size];
  const { bg, text } = colorMap[user];
  const label = user === 'alex' ? 'A' : 'J';
  const fontSize = size === 'sm' ? 11 : size === 'md' ? 14 : 17;

  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{ width: px, height: px, background: bg }}
    >
      <span style={{ color: text, fontSize, fontWeight: 600, lineHeight: 1 }}>{label}</span>
    </div>
  );
}
