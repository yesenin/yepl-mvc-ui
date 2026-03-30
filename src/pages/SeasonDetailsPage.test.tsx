import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../test/renderWithProviders';
import SeasonDetailsPage from './SeasonDetailsPage';

describe('SeasonDetailsPage', () => {
  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
    jest.restoreAllMocks();
  });

  it('loads and renders a season by route id', async () => {
    (global.fetch as jest.Mock).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/teams?skip=0&take=22')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            total: 2,
            skip: 0,
            take: 22,
            url: '/api/seasons/season-1992/teams',
            items: [
              { id: 'liverpool', name: 'Liverpool', optaId: null, abbreviation: 'LIV' },
              { id: 'arsenal', name: 'Arsenal', optaId: null, abbreviation: 'ARS' },
            ],
          }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'season-1992',
          title: '1992/93',
        }),
      } as Response);
    });

    renderWithProviders(
      <Routes>
        <Route path="/seasons/:seasonId" element={<SeasonDetailsPage />} />
      </Routes>,
      { route: '/seasons/season-1992' },
    );

    expect(await screen.findByRole('heading', { level: 3, name: '1992/93' })).not.toBeNull();
    expect(screen.getByText('Title: 1992/93')).not.toBeNull();
    expect(screen.getByText('Id: season-1992')).not.toBeNull();
    expect(await screen.findByText('Liverpool')).not.toBeNull();
    expect(screen.getByText('ARS')).not.toBeNull();
  });
});
