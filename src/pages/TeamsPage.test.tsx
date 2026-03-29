import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/renderWithProviders';
import TeamsPage from './TeamsPage';

describe('TeamsPage', () => {
  it('renders the teams page', () => {
    renderWithProviders(<TeamsPage />);

    expect(screen.getByText('Teams')).toBeInTheDocument();
  });
});
