import { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { FullScreenLoader } from './components/loader';
import { AppLayout } from './pages/Layout';

const Home = lazy(() => import('./pages/Home'));
const SessionSummary = lazy(() => import('./pages/SessionSummary'));
const SessionTips = lazy(() => import('./pages/SessionTips'));
const SessionResult = lazy(() => import('./pages/SessionResult'));
const TipsLibrary = lazy(() => import('./pages/TipsLibrary'));
const SessionsHistory = lazy(() => import('./pages/SessionsHistory'));

function App() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="session/:id" element={<SessionSummary />} />
            <Route path="session/:id/tips" element={<SessionTips />} />
            <Route path="session/:id/result" element={<SessionResult />} />
            <Route path="tips" element={<TipsLibrary />} />
            <Route path="sessions" element={<SessionsHistory />} />
          </Route>
          <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
