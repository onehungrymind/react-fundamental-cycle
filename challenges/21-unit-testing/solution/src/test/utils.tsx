// Challenge 21 — Unit Testing
//
// renderWithProviders wraps a component in all the providers it needs:
//
//   QueryClientProvider  — TanStack Query cache (fresh instance per test)
//   Provider (Redux)     — filters, sidebar, recently-viewed slices
//   ThemeProvider        — theme context consumed by useTheme()
//   AuthProvider         — user context consumed by useAuth()
//   MemoryRouter         — routing context consumed by useParams, Link, etc.
//
// A fresh QueryClient is created for every test call so query cache
// does not bleed between tests.  retry:false and gcTime:0 ensure that
// failed queries fail immediately and cache entries are cleaned up.

import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../context/ThemeContext'
import { AuthProvider } from '../context/AuthContext'
import { store } from '../store/redux/store'
import type { ReactElement } from 'react'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })
}

export function renderWithProviders(
  ui: ReactElement,
  options?: { route?: string },
) {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={[options?.route ?? '/']}>
              {ui}
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>,
  )
}
