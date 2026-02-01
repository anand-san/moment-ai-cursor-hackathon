import { CircleDot } from 'lucide-react';

interface IdentifiedProblemsProps {
  problems: string[];
}

export function IdentifiedProblems({ problems }: IdentifiedProblemsProps) {
  if (!problems || problems.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/30 dark:bg-black/10">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        What I noticed:
      </h3>
      <ul className="space-y-2">
        {problems.map((problem, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <CircleDot className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span>{problem}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
