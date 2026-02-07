import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import type { Tip } from '@sandilya-stack/shared/types';
import { Timer, Bell, MessageSquare, Bookmark, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { runTipAction, triggerSwipeHaptic } from '@/lib/nativeTipActions';

interface TipCardProps {
  tip: Tip;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 100;

export function TipCard({ tip, onSwipe, isTop }: TipCardProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(
    null,
  );
  const [isActionLoading, setIsActionLoading] = useState(false);
  const x = useMotionValue(0);

  // Transform x position to rotation (tilt effect)
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  // Background color overlay based on swipe direction - vibrant color feedback
  const backgroundColor = useTransform(
    x,
    [
      -SWIPE_THRESHOLD * 2,
      -SWIPE_THRESHOLD,
      0,
      SWIPE_THRESHOLD,
      SWIPE_THRESHOLD * 2,
    ],
    [
      'rgba(239, 68, 68, 0.5)',
      'rgba(239, 68, 68, 0.25)',
      'rgba(255, 255, 255, 0)',
      'rgba(34, 197, 94, 0.25)',
      'rgba(34, 197, 94, 0.5)',
    ],
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      setExitDirection('right');
      void triggerSwipeHaptic('right');
      onSwipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      setExitDirection('left');
      void triggerSwipeHaptic('left');
      onSwipe('left');
    }
  };

  const handleActionClick = async () => {
    if (isActionLoading) {
      return;
    }

    setIsActionLoading(true);
    try {
      const result = await runTipAction(tip);
      if (result.status === 'error') {
        toast.error(result.title, { description: result.description });
        return;
      }

      if (result.status === 'success') {
        toast.success(result.title, { description: result.description });
        return;
      }

      toast(result.title, { description: result.description });
    } finally {
      setIsActionLoading(false);
    }
  };

  const categoryColors = {
    immediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    habit:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    mindset:
      'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  };

  const actionIcons = {
    timer: Timer,
    reminder: Bell,
    message: MessageSquare,
    save: Bookmark,
  };

  const ActionIcon =
    tip.actionType !== 'none' ? actionIcons[tip.actionType] : null;

  return (
    <motion.div
      className={`absolute w-full ${isTop ? 'z-10' : 'z-0'}`}
      style={{ x, rotate }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{
        x: exitDirection === 'right' ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <motion.div className="relative p-6 rounded-2xl border shadow-lg min-h-[280px] flex flex-col overflow-hidden bg-card">
        {/* Color overlay for swipe feedback */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ backgroundColor }}
        />

        {/* Card content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4">
          {/* Title */}
          <h3 className="text-2xl font-bold leading-tight mb-3">{tip.title}</h3>

          {/* Description */}
          <p className="text-base text-muted-foreground leading-relaxed">
            {tip.description}
          </p>

          {/* Time estimate badge (especially relevant for immediate category) */}
          {tip.timeEstimate && (
            <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{tip.timeEstimate}</span>
            </div>
          )}

          {/* Action button (placeholder) */}
          {ActionIcon && (
            <Button
              type="button"
              variant="glass-outline"
              onClick={handleActionClick}
              disabled={isActionLoading}
              className="mt-4 rounded-full"
            >
              <ActionIcon className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">
                {tip.actionType === 'timer' && 'Start Timer'}
                {tip.actionType === 'reminder' && 'Set Reminder'}
                {tip.actionType === 'message' && 'Send Message'}
                {tip.actionType === 'save' && 'Save Tip'}
              </span>
            </Button>
          )}
        </div>

        {/* Tags */}
        <div className="flex justify-center gap-2 mt-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[tip.category]}`}
          >
            {tip.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            #{tip.tag}
          </span>
        </div>

        {/* Swipe hint */}
        {isTop && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Swipe left if not helpful, right if helpful
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
