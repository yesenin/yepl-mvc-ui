import { screen } from '@testing-library/react'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

describe('App routing', () => {
  it('renders the home page on the root route', () => {
    renderWithProviders(<App />, { route: '/' })

    expect(
      screen.getByRole('heading', {
        name: /production-ready react starter/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders the not found page for unknown routes', () => {
    renderWithProviders(<App />, { route: '/missing' })

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })
})
