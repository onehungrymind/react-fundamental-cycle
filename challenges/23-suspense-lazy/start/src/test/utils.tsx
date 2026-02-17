// Challenge 22 — Testing Async Operations & Mocking
//
// renderWithProviders wraps a component in all the providers it needs:
//
//   QueryClientProvider  — TanStack Query cache (fresh instance per test)
//   Provider (Redux)     — filters, sidebar, recently-viewed slices
//   ThemeProvider        — theme context consumed by useTheme()
//   AuthProvider         — user context consumed by useAuth()
//   MemoryRouter         — routing context consumed by useParams, Link, etc.
//
// What changed from Challenge 21:
//
//   1. Returns { ...renderResult, queryClient } so tests can seed or inspect
//      the cache without a network round-trip.
//
//   2. Accepts a `path` option.  When provided, the component is mounted
//      inside a <Routes><Route path={path} element={ui} /></Routes> so that
//      useParams() receives the correct parameters.  Without a path the
//      component renders directly (no Route wrapper) — fine for components
//      that don't read route params.
//
// Usage (with route params):
//
//   const { queryClient } = renderWithProviders(<ProjectDetailPanel />, {
//     route: '/projects/proj-1',
//     path:  '/projects/:projectId',
//   })
//
// Usage (without route params):
//
//   renderWithProviders(<ProjectsLayout />)

import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '../context/ThemeContext'
import { AuthProvider } from '../context/AuthContext'
import { store } from '../store/redux/store'
import type { ReactElement } from 'react'

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })
}

export function renderWithProviders(
  ui: ReactElement,
  options?: { route?: string; path?: string },
) {
  const queryClient = createTestQueryClient()

  const content =
    options?.path !== undefined ? (
      <Routes>
        <Route path={options.path} element={ui} />
      </Routes>
    ) : (
      ui
    )

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={[options?.route ?? '/']}>
              {content}
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>,
  )

  return { ...renderResult, queryClient }
}
