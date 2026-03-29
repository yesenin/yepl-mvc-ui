import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/renderWithProviders';
import SeasonsPage from './SeasonsPage';

describe('SeasonsPage', () => {
  it('renders the seasons page', () => {
    renderWithProviders(<SeasonsPage />);

    expect(screen.getByText('Seasons')).toBeInTheDocument();
  });
});
