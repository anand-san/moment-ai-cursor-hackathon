import { Heart } from 'lucide-react';

interface EmpathyResponseProps {
  message: string;
}

export function EmpathyResponse({ message }: EmpathyResponseProps) {
  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/40 dark:bg-black/20">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-full bg-primary/10">
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-lg leading-relaxed text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
