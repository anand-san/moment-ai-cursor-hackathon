import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SignIn from '@/components/auth/SignIn';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { FullScreenLoader } from '@/components/loader';
import { TabBar } from '@/components/ios';
import { useMemo, createContext, useContext, useState, ReactNode } from 'react';

// Context for voice recording state across pages
interface VoiceContextType {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  startRecording: () => void;
  stopRecording: () => void;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
};

export const AppLayout = () => {
  const { signOut } = useAuth();
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  // Determine if TabBar should be shown and which tab is active
  const tabBarConfig = useMemo(() => {
    const path = location.pathname;

    // Don't show TabBar on session flow pages
    if (path.includes('/session/')) {
      return { show: false, activeTab: 'home' as const };
    }

    // Determine active tab
    if (path === '/') {
      return { show: true, activeTab: 'home' as const };
    } else if (path === '/tips') {
      return { show: true, activeTab: 'tips' as const };
    } else if (path === '/sessions') {
      return { show: true, activeTab: 'sessions' as const };
    }

    return { show: false, activeTab: 'home' as const };
  }, [location.pathname]);

  const handleTipsClick = () => {
    navigate('/tips');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleHistoryClick = () => {
    navigate('/sessions');
  };

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  const voiceContextValue: VoiceContextType = {
    isRecording,
    setIsRecording,
    startRecording,
    stopRecording,
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <VoiceContext.Provider value={voiceContextValue}>
      <Outlet />

      {tabBarConfig.show && (
        <TabBar
          activeTab={tabBarConfig.activeTab}
          onTipsClick={handleTipsClick}
          onHomeClick={handleHomeClick}
          onHistoryClick={handleHistoryClick}
        />
      )}
    </VoiceContext.Provider>
  );
};
