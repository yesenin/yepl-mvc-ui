import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/renderWithProviders';
import SeasonsPage from './SeasonsPage';

describe('SeasonsPage', () => {
  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
    jest.restoreAllMocks();
  });

  it('loads and renders seasons from the API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 'season-1992', title: '1992/93' },
        { id: 'season-1993', title: '1993/94' },
      ],
    } as Response);

    renderWithProviders(<SeasonsPage />);

    expect(screen.getByText('Seasons')).not.toBeNull();

    const seasonLabel = await screen.findByText('1992/93');
    const seasonLink = seasonLabel.closest('a');

    expect(seasonLink).not.toBeNull();
    expect(seasonLink?.getAttribute('href')).toBe('/seasons/season-1992');
  });
});
