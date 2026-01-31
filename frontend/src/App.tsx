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
const SessionAnalyzing = lazy(() => import('./pages/SessionAnalyzing'));
const SessionSummary = lazy(() => import('./pages/SessionSummary'));
const Session = lazy(() => import('./pages/Session'));
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
            <Route path="session/:id" element={<SessionAnalyzing />} />
            <Route path="session/:id/summary" element={<SessionSummary />} />
            <Route path="session/:id/tips" element={<Session />} />
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
