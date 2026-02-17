// Challenge 22 — Testing Async Operations & Mocking
//
// renderWithProviders wraps a component in all the providers it needs.
//
// TODO 1: Return the queryClient alongside the render result.
//
//   Currently the function does not expose the QueryClient it creates.
//   Async tests need it to:
//     - Seed the cache before rendering (avoids a loading phase)
//     - Inspect what the cache contains after a mutation
//
//   Change the return type from `ReturnType<typeof render>` to:
//
//     { ...renderResult, queryClient }
//
// TODO 2: Support a `path` option for components that call useParams().
//
//   Components like ProjectDetailPanel read route params via useParams().
//   useParams() only returns values when the component is rendered inside
//   a <Route path="..."> element.
//
//   Add an optional `path` string to the options parameter.
//   When `path` is provided, wrap `ui` like this:
//
//     <Routes>
//       <Route path={path} element={ui} />
//     </Routes>
//
//   When `path` is absent, render `ui` directly (current behaviour).
//
//   Import `Routes` and `Route` from 'react-router-dom' at the top of the file.
//
// Usage after completing the TODOs:
//
//   // Component without route params (existing tests — no change needed):
//   renderWithProviders(<ProjectsLayout />)
//
//   // Component with route params:
//   const { queryClient } = renderWithProviders(<ProjectDetailPanel />, {
//     route: '/projects/proj-1',
//     path:  '/projects/:projectId',
//   })
//   queryClient.setQueryData(['projects', 'proj-1'], myFixture)

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
