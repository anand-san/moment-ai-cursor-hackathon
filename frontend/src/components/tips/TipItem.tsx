import type { ValuableTip, Tip } from '@sandilya-stack/shared/types';
import { Clock } from 'lucide-react';

interface TipItemProps {
  tip: Tip | ValuableTip;
  showContext?: boolean;
}

export function TipItem({ tip, showContext = false }: TipItemProps) {
  const isValuableTip = 'sessionText' in tip;
  const isFullTip = 'timeEstimate' in tip;

  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-white/40 dark:bg-black/20 transition-colors">
      {/* Title */}
      <h4 className="text-base font-semibold leading-snug">{tip.title}</h4>

      {/* Description */}
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        {tip.description}
      </p>

      {showContext && isValuableTip && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-medium">From: </span>
            &quot;{tip.sessionText}&quot;
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            #{tip.tag}
          </span>
        </div>

        {/* Time estimate (if available) */}
        {isFullTip && tip.timeEstimate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{tip.timeEstimate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
