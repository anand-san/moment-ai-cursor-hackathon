import { motion } from 'framer-motion';
import type { ValuableTip } from '@sandilya-stack/shared/types';

interface IosTipCardProps {
  tip: ValuableTip;
  index?: number;
}

export function IosTipCard({ tip, index = 0 }: IosTipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-4 rounded-xl border border-border bg-card"
    >
      {/* Main Tip Content */}
      <p className="text-[15px] font-medium text-foreground m-0 mb-2">
        {tip.content}
      </p>

      {/* Meta Information */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {tip.sessionText && (
          <span className="truncate">
            {tip.sessionText.length > 50
              ? tip.sessionText.slice(0, 50) + '...'
              : tip.sessionText}
          </span>
        )}
        {tip.tag && (
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
            {tip.tag}
          </span>
        )}
      </div>
    </motion.div>
  );
}
