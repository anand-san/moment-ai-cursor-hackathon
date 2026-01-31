import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TipCard } from './TipCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import type { Tip } from '@sandilya-stack/shared/types';

interface TipStackProps {
  tips: Tip[];
  onSwipe: (tipId: string, direction: 'left' | 'right') => Promise<void>;
  onRegenerate: () => Promise<void>;
  onComplete: () => void;
}

export function TipStack({
  tips,
  onSwipe,
  onRegenerate,
  onComplete,
}: TipStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isProcessingSwipe, setIsProcessingSwipe] = useState(false);

  const remainingTips = tips.slice(currentIndex);
  const progress = tips.length > 0 ? currentIndex / tips.length : 0;

  const handleSwipe = useCallback(
    async (direction: 'left' | 'right') => {
      if (isProcessingSwipe) return;

      const currentTip = tips[currentIndex];
      if (!currentTip) return;

      setIsProcessingSwipe(true);
      try {
        await onSwipe(currentTip.id, direction);
        setCurrentIndex(prev => prev + 1);

        // Check if we've gone through all tips
        if (currentIndex + 1 >= tips.length) {
          onComplete();
        }
      } finally {
        setIsProcessingSwipe(false);
      }
    },
    [currentIndex, tips, onSwipe, onComplete, isProcessingSwipe],
  );

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate();
      setCurrentIndex(0); // Reset to first card after regeneration
    } finally {
      setIsRegenerating(false);
    }
  };

  if (remainingTips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
          <span className="text-xl font-medium">All tips reviewed!</span>
        </div>
        <Button
          variant="outline"
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="gap-2"
        >
          {isRegenerating ? (
            <>
              <Loader2 className="animate-spin" />
              Generating new tips...
            </>
          ) : (
            <>
              <RefreshCw />
              Get different tips
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Tip {currentIndex + 1} of {tips.length}
          </span>
          <span>{Math.round(progress * 100)}% complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="relative h-[350px]">
        <AnimatePresence>
          {remainingTips.slice(0, 2).map((tip, index) => (
            <TipCard
              key={tip.id}
              tip={tip}
              onSwipe={handleSwipe}
              isTop={index === 0}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Regenerate button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="gap-2 text-muted-foreground"
        >
          {isRegenerating ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Not resonating? Get different tips
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
