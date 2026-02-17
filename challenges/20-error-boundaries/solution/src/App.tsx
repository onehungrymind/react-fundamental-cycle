import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import { store } from './store/redux/store'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProjectsLayout } from './pages/ProjectsLayout'
import { ProjectEmptyState } from './pages/ProjectEmptyState'
import { ProjectDetailPanel } from './pages/ProjectDetailPanel'
import { TaskList } from './components/TaskList'
import { TaskDetail } from './pages/TaskDetail'
import { NewProjectPage } from './pages/NewProjectPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GlobalErrorFallback } from './components/ErrorFallback'

// Challenge 20 — Error Boundaries
//
// This is the SOLUTION version.
//
// Changes from start/:
//
//   src/components/ErrorBoundary.tsx  (NEW)
//     - Class component with getDerivedStateFromError + componentDidCatch
//     - Accepts optional `fallback` render prop and `onError` callback
//     - resetError method resets state to re-render children
//
//   src/components/ErrorFallback.tsx  (NEW)
//     - DefaultErrorFallback: error message + Try Again + Report Issue
//     - GlobalErrorFallback: full-page error + Reload Application
//
//   src/hooks/useErrorHandler.ts  (NEW)
//     - Bridges async errors into the nearest ErrorBoundary
//
//   src/App.tsx  (this file)
//     - Global ErrorBoundary wraps the entire app
//
//   src/pages/ProjectsLayout.tsx
//     - ErrorBoundary around the project list <aside>
//
//   src/pages/ProjectDetailPanel.tsx
//     - ErrorBoundary around <ProjectDetailContent>
//
//   src/components/TaskList.tsx
//     - ErrorBoundary around <AddTaskForm>

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
    },
  },
})

export function App() {
  return (
    // Global boundary — last resort.
    // If anything outside a more-specific boundary throws, this catches it.
    // Uses window.location.reload() because the React tree is fully crashed
    // and we cannot trust any state or navigation to work.
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <GlobalErrorFallback error={error} resetError={resetError} />
      )}
      onError={(error, info) => {
        // In production, send to your error reporting service here:
        // Sentry.captureException(error, { extra: info });
        console.error('[GlobalErrorBoundary]', error, info)
      }}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Navigate to="/projects" replace />} />

                  <Route element={<Layout />}>
                    <Route path="/projects" element={<ProjectsLayout />}>
                      <Route index element={<ProjectEmptyState />} />
                      <Route path=":projectId" element={<ProjectDetailPanel />}>
                        <Route index element={<TaskList />} />
                        <Route path="tasks/:taskId" element={<TaskDetail />} />
                      </Route>
                    </Route>

                    <Route path="/projects/new" element={<NewProjectPage />} />
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
