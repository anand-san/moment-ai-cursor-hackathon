import { Outlet } from 'react-router-dom';
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
        <Outlet />
      </div>

      <BottomNav />
    </>
  );
};
