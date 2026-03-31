import { Outlet } from 'react-router';
import { AppProvider } from '../context/AppContext.tsx';

function StatusBar() {
  return (
    <div className="hidden sm:flex items-center justify-between px-8 pt-4 pb-1 shrink-0">
      <span style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1E', letterSpacing: '-0.3px' }}>
        9:41
      </span>
      <div className="flex items-center gap-[5px]">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="1" fill="#1C1C1E" />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill="#1C1C1E" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#1C1C1E" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1C1C1E" opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
          <path d="M7.5 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#1C1C1E" />
          <path d="M4.5 7.5C5.4 6.6 6.4 6 7.5 6s2.1.6 3 1.5" stroke="#1C1C1E" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M2 5C3.5 3.5 5.4 2.5 7.5 2.5S11.5 3.5 13 5" stroke="#1C1C1E" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M0 2.5C1.9.9 4.6 0 7.5 0s5.6.9 7.5 2.5" stroke="#1C1C1E" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#1C1C1E" strokeOpacity="0.35" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="#1C1C1E" />
          <path d="M23 4v4c.8-.4 1.3-1.1 1.3-2S23.8 4.4 23 4z" fill="#1C1C1E" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

export function Root() {
  return (
    <AppProvider>
      <div
        className="min-h-screen flex items-start sm:items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #C8C4BB 0%, #B8B5AC 100%)' }}
      >
        <div
          className="relative w-full sm:w-[390px] min-h-screen sm:min-h-0 sm:h-[844px] flex flex-col sm:rounded-[44px] sm:overflow-hidden"
          style={{
            background: '#F7F5F0',
            boxShadow: '0 48px 100px rgba(0,0,0,0.4), 0 12px 30px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.3)',
          }}
        >
          <StatusBar />
          <div className="flex-1 overflow-y-auto overscroll-none" style={{ WebkitOverflowScrolling: 'touch' }}>
            <Outlet />
          </div>
          {/* Home indicator */}
          <div className="hidden sm:flex justify-center pb-2 pt-1 shrink-0">
            <div
              className="w-[134px] h-[5px] rounded-full"
              style={{ background: 'rgba(28,28,30,0.2)' }}
            />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
