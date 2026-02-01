import { useMemo } from 'react';

const ANALYSIS_IMAGES = [
  '/analysis-images/1.png',
  '/analysis-images/2.png',
  '/analysis-images/3.png',
  '/analysis-images/4.png',
  '/analysis-images/5.png',
];

interface EmpathyResponseProps {
  message: string;
}

export function EmpathyResponse({ message }: EmpathyResponseProps) {
  const randomImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * ANALYSIS_IMAGES.length);
    return ANALYSIS_IMAGES[randomIndex];
  }, []);

  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/40 dark:bg-black/20">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={randomImage}
            alt="Analysis"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-lg leading-relaxed text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
