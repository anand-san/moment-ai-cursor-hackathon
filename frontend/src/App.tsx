import { Suspense, lazy, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { FullScreenLoader } from './components/loader';
import { AppLayout } from './pages/Layout';

const Home = lazy(() => import('./pages/Home'));
const SessionSummary = lazy(() => import('./pages/SessionSummary'));
const SessionTips = lazy(() => import('./pages/SessionTips'));
const SessionResult = lazy(() => import('./pages/SessionResult'));
const TipsLibrary = lazy(() => import('./pages/TipsLibrary'));
const SessionsHistory = lazy(() => import('./pages/SessionsHistory'));
const Profile = lazy(() => import('./pages/Profile'));

function NativeBackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathnameRef = useRef(location.pathname);

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let handle: { remove: () => Promise<void> } | undefined;

    const registerBackButton = async () => {
      handle = await CapacitorApp.addListener('backButton', () => {
        if (pathnameRef.current !== '/') {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/', { replace: true });
          }
          return;
        }
        CapacitorApp.exitApp();
      });
    };

    void registerBackButton();

    return () => {
      void handle?.remove();
    };
  }, [navigate]);

  return null;
}

function RedirectToHome() {
  const location = useLocation();
  return (
    <Navigate
      replace
      to={{
        pathname: '/',
        search: location.search,
        hash: location.hash,
      }}
    />
  );
}

function App() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Router>
        <NativeBackButtonHandler />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="session/:id" element={<SessionSummary />} />
            <Route path="session/:id/tips" element={<SessionTips />} />
            <Route path="session/:id/result" element={<SessionResult />} />
            <Route path="tips" element={<TipsLibrary />} />
            <Route path="sessions" element={<SessionsHistory />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<RedirectToHome />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
