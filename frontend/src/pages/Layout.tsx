import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SignIn from '@/components/auth/SignIn';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { FullScreenLoader } from '@/components/loader';
import { BottomNav } from '@/components/layout/BottomNav';

export const AppLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <>
      <div className="min-h-dvh pb-nav-safe">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>

      <BottomNav />
    </>
  );
};
