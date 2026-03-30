import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';

const DocsPage = lazy(() => import('./pages/DocsPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const SeasonDetailsPage = lazy(() => import('./pages/SeasonDetailsPage'));
const SeasonsPage = lazy(() => import('./pages/SeasonsPage'));
const TeamDetailsPage = lazy(() => import('./pages/TeamDetailsPage'));
const TeamsPage = lazy(() => import('./pages/TeamsPage'));

function RouteFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress size={28} />
    </Box>
  );
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="seasons" element={<SeasonsPage />} />
          <Route path="seasons/:seasonId" element={<SeasonDetailsPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="teams/:teamId" element={<TeamDetailsPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
