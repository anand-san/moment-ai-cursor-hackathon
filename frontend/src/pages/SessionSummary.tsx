import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, MessageSquare, Home, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { fontFamily, typography, colors, spacing, layout } from '@/theme/ios';
import { getSession } from '@/api/sessions';
import type { SessionWithId } from '@sandilya-stack/shared/types';
import { Button } from '@/components/ui/button';

export default function SessionSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch session data (analysis should already be complete from analyzing screen)
  useEffect(() => {
    if (!id) return;

    const fetchSession = async () => {
      try {
        const sessionData = await getSession(id);
        console.log('📊 Session data:', sessionData);
        setSession(sessionData);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Error fetching session:', err);
        setError(err instanceof Error ? err.message : 'Failed to load session');
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  const handleConfirm = () => {
    // Navigate to the tips/cards flow, passing session data to avoid refetch
    navigate(`/session/${id}/tips`, {
      state: { session, analysis: session?.analysis },
    });
  };

  const handleClarify = () => {
    // Navigate back to home to re-record
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !session || !session.analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="flex items-center gap-2 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg">{error || 'Session not found'}</span>
        </div>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const analysis = session.analysis as any; // Type assertion for backward compat
  const displayText = analysis?.empathy;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: `${spacing.layoutMargin}px`,
        paddingRight: `${spacing.layoutMargin}px`,
      }}
    >
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: colors.background.grouped,
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 60%),
              radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.25) 0%, transparent 60%),
              radial-gradient(circle at 40% 20%, rgba(196, 181, 253, 0.2) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg"
        style={{
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '28px',
          padding: `${spacing.xxl}px`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Title */}
        <h1
          className="text-center mb-6 font-bold"
          style={{
            fontSize: '24px',
            lineHeight: '32px',
            color: colors.label.primary,
            fontFamily: fontFamily.system,
            fontWeight: 700,
          }}
        >
          I've gathered this...
        </h1>

        {/* User Quote */}
        <p
          className="text-center mb-8"
          style={{
            fontSize: '18px',
            lineHeight: '28px',
            color: colors.label.secondary,
            fontFamily: fontFamily.system,
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          "{displayText}"
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          {/* Primary Button - Confirm */}
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center transition-opacity active:opacity-70"
            style={{
              backgroundColor: '#2563EB', // blue-600
              border: 'none',
              borderRadius: `${layout.cornerRadius.medium}px`,
              minHeight: `${layout.minTouchTarget}px`,
              paddingTop: '14px',
              paddingBottom: '14px',
              paddingLeft: '20px',
              paddingRight: '20px',
              cursor: 'pointer',
              gap: `${spacing.sm}px`,
            }}
          >
            <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
            <span
              style={{
                fontSize: typography.headline.fontSize,
                fontWeight: typography.headline.fontWeight,
                letterSpacing: typography.headline.letterSpacing,
                color: '#FFFFFF',
                fontFamily: fontFamily.system,
              }}
            >
              That's right
            </span>
          </button>

          {/* Secondary Button - Clarify */}
          <button
            onClick={handleClarify}
            className="flex-1 flex items-center justify-center transition-opacity active:opacity-70"
            style={{
              backgroundColor: 'rgba(243, 244, 246, 0.5)', // gray-100/50
              border: 'none',
              borderRadius: `${layout.cornerRadius.medium}px`,
              minHeight: `${layout.minTouchTarget}px`,
              paddingTop: '14px',
              paddingBottom: '14px',
              paddingLeft: '20px',
              paddingRight: '20px',
              cursor: 'pointer',
              gap: `${spacing.sm}px`,
            }}
          >
            <MessageSquare size={20} color={colors.primary} strokeWidth={2.5} />
            <span
              style={{
                fontSize: typography.headline.fontSize,
                fontWeight: typography.headline.fontWeight,
                letterSpacing: typography.headline.letterSpacing,
                color: colors.primary,
                fontFamily: fontFamily.system,
              }}
            >
              Let me clarify
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
