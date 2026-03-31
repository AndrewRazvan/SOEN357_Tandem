import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  onBack?: () => void;
  rightEl?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, backTo, onBack }: ScreenHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="px-5 pt-5 pb-4">
      {(backTo !== undefined || onBack !== undefined) && (
        <button
          onClick={handleBack}
          className="flex items-center gap-1 mb-4 min-h-[44px] -ml-1 px-1"
          style={{ color: '#7B9D8F' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
          <span style={{ fontSize: '15px', fontWeight: 500 }}>Back</span>
        </button>
      )}
      <div>
        <h1 style={{ color: '#1C1C1E', letterSpacing: '-0.5px' }}>{title}</h1>
        {subtitle && (
          <p className="mt-1" style={{ color: '#8E8E93', fontSize: '14px', fontWeight: 400 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
