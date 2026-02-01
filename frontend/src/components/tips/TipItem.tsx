import type { ValuableTip, Tip } from '@sandilya-stack/shared/types';

interface TipItemProps {
  tip: Tip | ValuableTip;
  showContext?: boolean;
}

export function TipItem({ tip, showContext = false }: TipItemProps) {
  const isValuableTip = 'sessionText' in tip;

  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-white/40 dark:bg-black/20 transition-colors">
      <p className="text-base font-medium leading-relaxed">{tip.content}</p>

      {showContext && isValuableTip && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-medium">From: </span>
            &quot;{tip.sessionText}&quot;
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          #{tip.tag}
        </span>
      </div>
    </div>
  );
}
