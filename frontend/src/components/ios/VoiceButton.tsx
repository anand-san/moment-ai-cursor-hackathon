import { useState, useEffect, useRef, useCallback } from 'react';
import { colors, layout, animations, fontFamily } from '@/theme/ios';

interface VoiceButtonProps {
  isRecording: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
  disabled?: boolean;
  recordingDuration?: number; // in seconds
}

export function VoiceButton({
  isRecording,
  onPressStart,
  onPressEnd,
  disabled = false,
  recordingDuration = 0,
}: VoiceButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pressStartTimeRef = useRef<number>(0);
  const MIN_PRESS_DURATION = 300; // ms

  // Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled || isPressed) return;

      e.preventDefault();
      e.stopPropagation();

      // Capture pointer so DOM changes don't cancel the press
      e.currentTarget.setPointerCapture(e.pointerId);

      pressStartTimeRef.current = Date.now();
      setIsPressed(true);
      onPressStart();
    },
    [disabled, isPressed, onPressStart],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled || !isPressed) return;

      const pressDuration = Date.now() - pressStartTimeRef.current;
      if (pressDuration < MIN_PRESS_DURATION) return;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // no-op: capture may already be released
      }

      setIsPressed(false);
      onPressEnd();
    },
    [disabled, isPressed, onPressEnd],
  );

  return (
    <div className="voice-button-container">
      <button
        ref={buttonRef}
        type="button"
        className={`voice-button ${isPressed ? 'pressed' : ''} ${
          isRecording ? 'recording' : ''
        } ${!prefersReducedMotion && !isRecording ? 'pulse' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        disabled={disabled}
        aria-label="Start recording. Hold to speak."
        aria-pressed={isRecording}
      >
        {isRecording ? <WaveformIcon /> : <MicrophoneIcon />}
      </button>

      {/* Timer - always reserves space */}
      <div className="recording-timer">
        {isRecording ? formatTime(recordingDuration) : '\u00A0'}
      </div>

      <style>{`
        .voice-button-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .voice-button {
          width: ${layout.voiceButton}px;
          height: ${layout.voiceButton}px;
          border-radius: ${layout.voiceButton / 2}px;
          background-color: ${colors.primaryLight};
          border: 1px solid ${colors.primaryMedium};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all ${animations.quick.duration}
            ${animations.quick.easing};
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          position: relative;
          z-index: 10;
        }

        .voice-button:focus-visible {
          box-shadow: 0 0 0 4px ${colors.primaryLight};
        }

        .voice-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .voice-button.pulse {
          animation: idle-pulse ${animations.pulse.duration}
            ${animations.pulse.easing} infinite;
        }

        @keyframes idle-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .voice-button.pressed {
          background-color: ${colors.primaryMedium};
          border-color: ${colors.primaryDark};
          transform: scale(0.96);
          animation: none;
        }

        .voice-button.recording {
          background-color: ${colors.primaryMedium};
          border-color: ${colors.primary};
          animation: none;
        }

        .recording-timer {
          font-family: ${fontFamily.system};
          font-size: 15px;
          font-weight: 500;
          color: ${colors.label.secondary};
          font-variant-numeric: tabular-nums;
          min-height: 20px;
          opacity: 1;
          transition: opacity 150ms ease-out;
        }

        .recording-timer:empty {
          opacity: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .voice-button.pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function MicrophoneIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
        fill={colors.primary}
      />
      <path
        d="M6 10V12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12V10"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 18V22M12 22H8M12 22H16"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WaveformIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12H4.01M8 8V16M12 5V19M16 8V16M20 12H20.01"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="waveform-bars"
      />
      <style>{`
        .waveform-bars {
          animation: waveform-animate 0.5s ease-in-out infinite alternate;
        }
        @keyframes waveform-animate {
          0% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </svg>
  );
}
