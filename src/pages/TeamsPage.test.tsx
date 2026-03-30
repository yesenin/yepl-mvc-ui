import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/renderWithProviders';
import TeamsPage from './TeamsPage';

describe('TeamsPage', () => {
  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
    jest.restoreAllMocks();
  });

  it('loads and renders teams from the API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 'liverpool', name: 'Liverpool', optaId: null, abbreviation: 'LIV' },
        { id: 'arsenal', name: 'Arsenal', optaId: null, abbreviation: 'ARS' },
      ],
    } as Response);

    renderWithProviders(<TeamsPage />);

    expect(screen.getByText('Teams')).not.toBeNull();

    const liverpoolLabel = await screen.findByText('Liverpool');
    const liverpoolLink = liverpoolLabel.closest('a');

    expect(liverpoolLink).not.toBeNull();
    expect(liverpoolLink?.getAttribute('href')).toBe('/teams/liverpool');
    expect(screen.getByText('ARS')).not.toBeNull();
  });
});
