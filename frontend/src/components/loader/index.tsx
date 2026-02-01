import { Loader2 } from 'lucide-react';

export { AnalysisLoader } from './AnalysisLoader';

export function Loader() {
  return <div className="spinner"></div>;
}

interface FullScreenLoaderProps {
  message?: string;
}

export const FullScreenLoader = ({ message }: FullScreenLoaderProps) => (
  <div className="h-screen flex flex-col justify-center items-center">
    <Loader2 className="animate-spin" />
    {message && <p className="text-muted-foreground">{message}</p>}
  </div>
);
