import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import DocsPage from './pages/DocsPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SeasonsPage from './pages/SeasonsPage';
import TeamsPage from './pages/TeamsPage';
import GamesPage from './pages/GamesPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="seasons" element={<SeasonsPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
