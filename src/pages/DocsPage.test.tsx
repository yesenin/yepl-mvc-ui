import { screen } from '@testing-library/react';
import DocsPage from './DocsPage';
import { renderWithProviders } from '../test/renderWithProviders';

describe('DocsPage', () => {
  it('lists the starter commands', () => {
    renderWithProviders(<DocsPage />);

    expect(screen.getByText('npm run dev')).not.toBeNull();
    expect(screen.getByText('npm run test')).not.toBeNull();
  });
});
