import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FullScreenLoader } from '@/components/loader';
import { getAllSessions } from '@/api/sessions';
import {
  AlertCircle,
  Inbox,
  ThumbsUp,
  ChevronRight,
  Brain,
} from 'lucide-react';
import type { SessionSummary } from '@sandilya-stack/shared/types';
import { motion } from 'framer-motion';

export default function SessionsHistory() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getAllSessions();
        setSessions(response.sessions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load sessions',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FullScreenLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-[calc(90px+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[calc(90px+env(safe-area-inset-bottom))] max-w-[480px] mx-auto bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-[34px] font-bold leading-[41px] tracking-[0.37px] mb-2">
          History
        </h1>
        <p className="text-[17px] text-muted-foreground">
          Your past sessions and results.
        </p>
      </motion.div>

      {/* Sessions list */}
      {sessions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={
                  session.hasAnalysis
                    ? `/session/${session.id}/result`
                    : `/session/${session.id}`
                }
                className="no-underline"
              >
                <div className="p-4 rounded-xl border border-border bg-card cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-foreground m-0 overflow-hidden text-ellipsis line-clamp-2">
                        {truncateText(session.text)}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{formatDate(session.createdAt)}</span>
                        {session.helpfulTipsCount > 0 && (
                          <span className="flex items-center gap-1 text-green-600">
                            <ThumbsUp className="h-3 w-3" />
                            {session.helpfulTipsCount}
                          </span>
                        )}
                        {!session.hasAnalysis && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Brain className="h-3 w-3" />
                            Open
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center py-12"
        >
          <Inbox className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No sessions yet</h2>
          <p className="text-muted-foreground max-w-[280px]">
            Start your first session to see your history.
          </p>
        </motion.div>
      )}

      {/* Stats footer */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p className="m-0">
            {sessions.length} Session{sessions.length > 1 ? 's' : ''} insgesamt
          </p>
        </motion.div>
      )}
    </div>
  );
}
