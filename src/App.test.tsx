import { screen } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './test/renderWithProviders';

describe('App routing', () => {
  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
    jest.restoreAllMocks();
  });

  it('renders the home page on the root route', () => {
    renderWithProviders(<App />, { route: '/' });

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /yepl CMS \(kinda\)/i,
      }),
    ).not.toBeNull();
  });

  it('renders the not found page for unknown routes', () => {
    renderWithProviders(<App />, { route: '/missing' });

    expect(screen.getByRole('heading', { name: /page not found/i })).not.toBeNull();
  });

  it('renders a team details route', async () => {
    (global.fetch as jest.Mock).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/seasons?skip=0&take=10')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            total: 1,
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
          optaId: null,
          abbreviation: 'LIV',
        }),
      } as Response);
    });

    renderWithProviders(<App />, { route: '/teams/liverpool' });

    expect(await screen.findByRole('heading', { level: 3, name: 'Liverpool' })).not.toBeNull();
  });

  it('renders a season details route', async () => {
    (global.fetch as jest.Mock).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/teams?skip=0&take=22')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            total: 1,
            skip: 0,
            take: 22,
            url: '/api/seasons/season-1992/teams',
            items: [{ id: 'liverpool', name: 'Liverpool', optaId: null, abbreviation: 'LIV' }],
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

    renderWithProviders(<App />, { route: '/seasons/season-1992' });

    expect(await screen.findByRole('heading', { level: 3, name: '1992/93' })).not.toBeNull();
  });
});
