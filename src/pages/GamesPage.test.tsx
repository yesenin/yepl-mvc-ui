import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/renderWithProviders';
import GamesPage from './GamesPage';

describe('GamesPage', () => {
  it('renders the games page', () => {
    renderWithProviders(<GamesPage />);

    expect(screen.getByText('Games')).toBeInTheDocument();
  });
});
