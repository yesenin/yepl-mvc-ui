import type { PropsWithChildren, ReactElement } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { appTheme } from '../theme/theme'

type RenderOptions = {
  route?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: RenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </ThemeProvider>
    )
  }

  return render(ui, { wrapper: Wrapper })
}
