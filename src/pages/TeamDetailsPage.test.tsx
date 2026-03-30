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

  function mockTeamDetailsRequests(options?: {
    onUpdate?: (request: { url: string; init: RequestInit | undefined }) => void;
    failUpdate?: boolean;
    emptyUpdateResponse?: boolean;
  }) {
    (global.fetch as jest.Mock).mockImplementation(
      (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (init?.method === 'PUT') {
          options?.onUpdate?.({ url, init });

          if (options?.failUpdate) {
            return Promise.resolve({
              ok: false,
              status: 500,
              json: async () => ({ message: 'failed' }),
            } as Response);
          }

          if (options?.emptyUpdateResponse) {
            return Promise.resolve({
              ok: true,
              status: 204,
              text: async () => '',
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
        }

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
      },
    );
  }

  it('loads and renders a team by route id', async () => {
    mockTeamDetailsRequests();

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

  it('saves an edited overview field', async () => {
    const user = userEvent.setup();
    let requestBody: string | undefined;

    mockTeamDetailsRequests({
      emptyUpdateResponse: true,
      onUpdate: ({ init }) => {
        requestBody = String(init?.body);
      },
    });

    renderWithProviders(
      <Routes>
        <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
      </Routes>,
      { route: '/teams/liverpool' },
    );

    expect(await screen.findByRole('heading', { level: 3, name: 'Liverpool' })).not.toBeNull();

    await user.click(screen.getByRole('button', { name: /edit overview/i }));

    const abbreviationInput = screen.getByLabelText('Abbreviation');

    await user.clear(abbreviationInput);
    await user.type(abbreviationInput, 'LFC');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Abbreviation: LFC')).not.toBeNull();
    expect(requestBody).toBe(
      JSON.stringify({
        id: 'liverpool',
        name: 'Liverpool',
        optaId: '14',
        abbreviation: 'LFC',
      }),
    );
    expect(screen.queryByText('Loading team details...')).toBeNull();
  });

  it('cancels an overview edit without saving', async () => {
    const user = userEvent.setup();

    mockTeamDetailsRequests();

    renderWithProviders(
      <Routes>
        <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
      </Routes>,
      { route: '/teams/liverpool' },
    );

    expect(await screen.findByRole('heading', { level: 3, name: 'Liverpool' })).not.toBeNull();

    await user.click(screen.getByRole('button', { name: /edit overview/i }));

    const optaIdInput = screen.getByLabelText('Opta id');

    await user.clear(optaIdInput);
    await user.type(optaIdInput, '999');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Opta id: 14')).not.toBeNull();
    expect(
      (global.fetch as jest.Mock).mock.calls.some(
        ([, init]) => (init as RequestInit | undefined)?.method === 'PUT',
      ),
    ).toBe(false);
  });

  it('keeps the field open when saving fails', async () => {
    const user = userEvent.setup();

    mockTeamDetailsRequests({ failUpdate: true });

    renderWithProviders(
      <Routes>
        <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
      </Routes>,
      { route: '/teams/liverpool' },
    );

    expect(await screen.findByRole('heading', { level: 3, name: 'Liverpool' })).not.toBeNull();

    await user.click(screen.getByRole('button', { name: /edit overview/i }));
    await user.clear(screen.getByLabelText('Abbreviation'));
    await user.type(screen.getByLabelText('Abbreviation'), 'LFC');
    await user.keyboard('{Enter}');

    expect(
      await screen.findByText('Failed to save team: Request failed with status 500'),
    ).not.toBeNull();
    expect(screen.getByLabelText('Abbreviation')).not.toBeNull();
  });
});
