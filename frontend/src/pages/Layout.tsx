import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SignIn from '@/components/auth/SignIn';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { FullScreenLoader } from '@/components/loader';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageTransition } from '@/components/layout/PageTransition';

export const AppLayout = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <>
      <div className="min-h-screen pb-20">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </div>

      <BottomNav />
    </>
  );
};
