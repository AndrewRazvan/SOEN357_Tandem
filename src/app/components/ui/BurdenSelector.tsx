interface BurdenSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

const LABELS: Record<number, string> = {
  1: 'Very light',
  2: 'Light',
  3: 'Fairly light',
  4: 'Moderate',
  5: 'Fairly heavy',
  6: 'Heavy',
  7: 'Very heavy',
};

// Green → Yellow → Red (1 = lightest/green, 7 = heaviest/red)
const RATING_COLORS: Record<number, string> = {
  1: '#4A9940',
  2: '#7DB83A',
  3: '#B8CC3A',
  4: '#F0C030',
  5: '#F0A040',
  6: '#E86848',
  7: '#D63C3C',
};

export function BurdenSelector({ value, onChange }: BurdenSelectorProps) {
  return (
    <div className="w-full">
      {/* Segmented selector */}
      <div className="flex gap-1.5 justify-between">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150 active:scale-95"
              style={{
                background: selected ? RATING_COLORS[n] : '#EFEDE8',
                minHeight: 64,
                outline: 'none',
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: selected ? '#FFFFFF' : '#5C5C60',
                  lineHeight: 1,
                }}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Extremes label */}
      <div className="flex justify-between mt-2.5">
        <span style={{ fontSize: '12px', color: '#8E8E93' }}>Very light</span>
        <span style={{ fontSize: '12px', color: '#8E8E93' }}>Very heavy</span>
      </div>

      {/* Selected label */}
      {value !== null && (
        <div
          className="mt-4 text-center py-3 rounded-xl"
          style={{ background: RATING_COLORS[value] + '22' }}
        >
          <span style={{ fontSize: '15px', fontWeight: 500, color: RATING_COLORS[value] }}>
            {LABELS[value!]}
          </span>
        </div>
      )}
    </div>
  );
}
