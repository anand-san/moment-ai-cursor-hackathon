import { ReactNode, ButtonHTMLAttributes } from 'react';
import {
  colors,
  layout,
  typography,
  fontFamily,
  animations,
} from '@/theme/ios';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function SecondaryButton({
  children,
  icon,
  fullWidth = false,
  disabled,
  ...props
}: SecondaryButtonProps) {
  return (
    <>
      <button
        className={`ios-secondary-button ${fullWidth ? 'full-width' : ''}`}
        disabled={disabled}
        {...props}
      >
        {icon && <span className="button-icon">{icon}</span>}
        <span className="button-text">{children}</span>
      </button>

      <style>{`
        .ios-secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 50px;
          padding: 16px 20px;
          background-color: ${colors.fill.tertiary};
          border: none;
          border-radius: ${layout.cornerRadius.medium}px;
          cursor: pointer;
          transition: opacity ${animations.quick.duration} ${animations.quick.easing};
          font-family: ${fontFamily.system};
          font-size: ${typography.headline.fontSize};
          font-weight: ${typography.headline.fontWeight};
          letter-spacing: ${typography.headline.letterSpacing};
          color: ${colors.primary};
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          outline: none;
        }

        .ios-secondary-button.full-width {
          width: 100%;
        }

        .ios-secondary-button:hover {
          opacity: 0.85;
        }

        .ios-secondary-button:active {
          opacity: 0.7;
        }

        .ios-secondary-button:focus-visible {
          box-shadow: 0 0 0 4px ${colors.primaryLight};
        }

        .ios-secondary-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .button-icon svg {
          width: 20px;
          height: 20px;
        }

        .button-text {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}

// Clock icon for "Vergangene Sessions"
export function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 6V12L16 14"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4.5 4.5L2 2M2 7L2 2L7 2"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Lightbulb icon for "Meine hilfreichen Tipps"
export function LightbulbIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 21H15"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 17H14"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2C8.13401 2 5 5.13401 5 9C5 11.3869 6.14514 13.4963 7.92893 14.7929C8.65685 15.3431 9 16.1716 9 17H15C15 16.1716 15.3431 15.3431 16.0711 14.7929C17.8549 13.4963 19 11.3869 19 9C19 5.13401 15.866 2 12 2Z"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
