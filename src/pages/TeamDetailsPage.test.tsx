import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import TeamDetailsPage from './TeamDetailsPage';
import { renderWithProviders } from '../test/renderWithProviders';

describe('TeamDetailsPage', () => {
  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
    jest.restoreAllMocks();
  });

  it('loads and renders a team by route id', async () => {
    (global.fetch as jest.Mock).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/seasons?skip=0&take=10')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            total: 12,
            skip: 0,
            take: 10,
            url: '/api/teams/liverpool/seasons',
            items: [
              { id: '1992', title: '1992/93' },
              { id: '1993', title: '1993/94' },
            ],
          }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'liverpool',
          name: 'Liverpool',
          optaId: '14',
          abbreviation: 'LIV',
        }),
      } as Response);
    });

    renderWithProviders(
      <Routes>
        <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
      </Routes>,
      { route: '/teams/liverpool' },
    );

    expect(await screen.findByRole('heading', { level: 3, name: 'Liverpool' })).not.toBeNull();
    expect(await screen.findByText('1992/93')).not.toBeNull();
    expect(screen.getByText('Abbreviation: LIV')).not.toBeNull();
    expect(screen.getByText('Opta id: 14')).not.toBeNull();
  });

  it('loads the next seasons page when pagination changes', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/seasons?skip=10&take=10')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            total: 12,
            skip: 10,
            take: 10,
            url: '/api/teams/liverpool/seasons',
            items: [{ id: '2003', title: '2003/04' }],
          }),
        } as Response);
      }

      if (url.includes('/seasons?skip=0&take=10')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            total: 12,
            skip: 0,
            take: 10,
            url: '/api/teams/liverpool/seasons',
            items: [{ id: '1992', title: '1992/93' }],
          }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'liverpool',
          name: 'Liverpool',
          optaId: '14',
          abbreviation: 'LIV',
        }),
      } as Response);
    });

    renderWithProviders(
      <Routes>
        <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
      </Routes>,
      { route: '/teams/liverpool' },
    );

    expect(await screen.findByText('1992/93')).not.toBeNull();

    await user.click(screen.getByRole('button', { name: /go to page 2/i }));

    expect(await screen.findByText('2003/04')).not.toBeNull();
  });
});
