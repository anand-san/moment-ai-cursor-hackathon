import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnalyzingScreen } from '@/components/ios';
import { getSession, analyzeSession } from '@/api/sessions';

/**
 * SessionAnalyzing - Shows analyzing screen while processing session
 * After analysis completes, navigates to summary screen
 */
export default function SessionAnalyzing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const processSession = async () => {
      try {
        // Get session data
        const sessionData = await getSession(id);

        // If no analysis yet, trigger it (this may take a few seconds)
        if (!sessionData.analysis) {
          console.log('🤖 Starting analysis...');
          await analyzeSession(id);
          console.log('✅ Analysis complete');
        } else {
          console.log('✅ Analysis already exists, navigating to summary');
        }

        // Navigate to summary screen after analysis is ready
        navigate(`/session/${id}/summary`, { replace: true });
      } catch (err) {
        console.error('❌ Error processing session:', err);
        // On error, still navigate to summary (it will handle the error state)
        navigate(`/session/${id}/summary`, { replace: true });
      }
    };

    processSession();
  }, [id, navigate]);

  return <AnalyzingScreen />;
}
