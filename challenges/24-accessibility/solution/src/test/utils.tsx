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
