import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmpathyResponse } from '@/components/tips/EmpathyResponse';
import { IdentifiedProblems } from '@/components/tips/IdentifiedProblems';
import { FullScreenLoader } from '@/components/loader';
import { getSession, analyzeSession, regenerateTips } from '@/api/sessions';
import { Home, AlertCircle, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import type { SessionWithId, Analysis } from '@sandilya-stack/shared/types';

export default function SessionSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionWithId | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch session data
  useEffect(() => {
    if (!id) return;

    const fetchSession = async () => {
      try {
        const sessionData = await getSession(id);
        setSession(sessionData);

        if (sessionData.analysis) {
          setAnalysis(sessionData.analysis);
          setIsLoading(false);
        } else {
          // Analysis not ready yet, trigger it
          const analysisData = await analyzeSession(id);
          setAnalysis(analysisData);
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session');
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  const handleRegenerate = useCallback(async () => {
    if (!id) return;
    setIsRegenerating(true);
    try {
      const newAnalysis = await regenerateTips(id);
      setAnalysis(newAnalysis);
    } finally {
      setIsRegenerating(false);
    }
  }, [id]);

  const handleContinueToTips = useCallback(() => {
    if (!id) return;
    navigate(`/session/${id}/tips`);
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <FullScreenLoader />
        <p className="mt-4 text-muted-foreground">Analyzing your thoughts...</p>
      </div>
    );
  }

  if (error || !session || !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="flex items-center gap-2 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg">{error || 'Session not found'}</span>
        </div>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-lg mx-auto relative z-10">
      {/* Empathy Response */}
      <div className="mb-6 text-center">
        <EmpathyResponse message={analysis.empathy} />
      </div>

      {/* Identified Problems */}
      <IdentifiedProblems problems={analysis.identifiedProblems} />

      {/* Continue to Tips button */}
      <div className="flex-1 flex flex-col justify-center">
        <Button
          size="lg"
          onClick={handleContinueToTips}
          className="w-full gap-2 py-6 text-lg"
        >
          Continue to Tips
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Regenerate button at bottom */}
      <div className="flex justify-center pt-8">
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
              Generating new analysis...
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
