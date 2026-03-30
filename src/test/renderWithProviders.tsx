import type { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppProviders from '../app/AppProviders';
import { createAppStore, type AppStore } from '../app/store';

type RenderOptions = {
  route?: string;
  store?: AppStore;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', store = createAppStore() }: RenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <AppProviders store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </AppProviders>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}
