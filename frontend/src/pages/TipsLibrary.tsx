import { useState, useEffect } from 'react';
import { IosTipCard } from '@/components/ios';
import { FullScreenLoader } from '@/components/loader';
import { getValuableTips } from '@/api/sessions';
import { AlertCircle, Inbox } from 'lucide-react';
import type { ValuableTip } from '@sandilya-stack/shared/types';
import { motion } from 'framer-motion';

export default function TipsLibrary() {
  const [tips, setTips] = useState<ValuableTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await getValuableTips();
        setTips(response.tips);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tips');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, []);

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
          My Tips
        </h1>
        <p className="text-[17px] text-muted-foreground">
          All helpful tips from your sessions.
        </p>
      </motion.div>

      {/* Tips list */}
      {tips.length > 0 ? (
        <div className="flex flex-col gap-3">
          {tips.map((tip, index) => (
            <IosTipCard
              key={`${tip.sessionId}-${tip.id}`}
              tip={tip}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center py-12"
        >
          <Inbox className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tips saved yet</h2>
          <p className="text-muted-foreground max-w-[280px]">
            Start a session and mark helpful tips to save them.
          </p>
        </motion.div>
      )}

      {/* Stats footer */}
      {tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p className="m-0">
            {tips.length} Tip{tips.length > 1 ? 's' : ''} saved
          </p>
        </motion.div>
      )}
    </div>
  );
}
