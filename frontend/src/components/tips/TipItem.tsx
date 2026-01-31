import { motion } from 'framer-motion';
import type { ValuableTip, Tip } from '@sandilya-stack/shared/types';

interface TipItemProps {
  tip: Tip | ValuableTip;
  showContext?: boolean;
  index?: number;
}

export function TipItem({ tip, showContext = false, index = 0 }: TipItemProps) {
  const isValuableTip = 'sessionText' in tip;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
    >
      <p className="text-base font-medium leading-relaxed">{tip.content}</p>

      {showContext && isValuableTip && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-medium">From: </span>
            &quot;{tip.sessionText}&quot;
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          #{tip.tag}
        </span>
      </div>
    </motion.div>
  );
}
