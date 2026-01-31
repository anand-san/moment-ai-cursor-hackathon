import { colors, fontFamily } from '@/theme/ios';

interface TabBarProps {
  activeTab: 'home' | 'tips' | 'sessions';
  onTipsClick: () => void;
  onHomeClick: () => void;
  onHistoryClick: () => void;
}

export function TabBar({
  activeTab,
  onTipsClick,
  onHomeClick,
  onHistoryClick,
}: TabBarProps) {
  return (
    <>
      <div className="tab-bar-container">
        <div className="tab-bar">
          {/* Tips Tab */}
          <button
            className={`tab-item ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={onTipsClick}
            aria-label="Tips"
          >
            <LightbulbTabIcon isActive={activeTab === 'tips'} />
            <span className="tab-label">Tips</span>
          </button>

          {/* Home/AI Assistant Tab */}
          <button
            className={`tab-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={onHomeClick}
            aria-label="Assistant"
          >
            <AIAssistantIcon isActive={activeTab === 'home'} />
            <span className="tab-label">Assistant</span>
          </button>

          {/* History Tab */}
          <button
            className={`tab-item ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={onHistoryClick}
            aria-label="History"
          >
            <ClockTabIcon isActive={activeTab === 'sessions'} />
            <span className="tab-label">History</span>
          </button>
        </div>
      </div>

      <style>{`
        .tab-bar-container {
          position: fixed;
          bottom: max(16px, env(safe-area-inset-bottom));
          right: 16px;
          z-index: 100;
          display: flex;
          justify-content: flex-end;
          pointer-events: none;
        }

        .tab-bar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          height: 60px;
          width: 280px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          border-radius: 30px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          padding: 0 12px;
          gap: 12px;
          pointer-events: auto;
          border: 0.5px solid rgba(255, 255, 255, 0.3);
        }

        .tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          min-height: 44px;
          min-width: 44px;
          transition: opacity 150ms ease-out;
          outline: none;
          border-radius: 12px;
        }

        .tab-item:active {
          opacity: 0.6;
          transform: scale(0.95);
        }

        .tab-label {
          font-family: ${fontFamily.system};
          font-size: 10px;
          font-weight: 500;
          line-height: 12px;
          color: ${colors.label.secondary};
          transition: color 150ms ease-out;
        }

        .tab-item.active .tab-label {
          color: ${colors.primary};
        }

        /* High contrast support */
        @media (prefers-contrast: high) {
          .tab-bar {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(0, 0, 0, 0.2);
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .tab-item:active {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}

// Tab Icons
function LightbulbTabIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? colors.primary : colors.label.secondary;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 21H15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 17H14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2C8.13401 2 5 5.13401 5 9C5 11.3869 6.14514 13.4963 7.92893 14.7929C8.65685 15.3431 9 16.1716 9 17H15C15 16.1716 15.3431 15.3431 16.0711 14.7929C17.8549 13.4963 19 11.3869 19 9C19 5.13401 15.866 2 12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AIAssistantIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? colors.primary : colors.label.secondary;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main sparkle */}
      <path
        d="M12 2L13.5 7.5L19 9L13.5 10.5L12 16L10.5 10.5L5 9L10.5 7.5L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Small sparkle top right */}
      <path
        d="M19 4L19.5 5.5L21 6L19.5 6.5L19 8L18.5 6.5L17 6L18.5 5.5L19 4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Small sparkle bottom left */}
      <path
        d="M7 17L7.5 18.5L9 19L7.5 19.5L7 21L6.5 19.5L5 19L6.5 18.5L7 17Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockTabIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? colors.primary : colors.label.secondary;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 7V12L15 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
