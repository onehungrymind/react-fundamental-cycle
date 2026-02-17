// Challenge 24 — Accessibility Fundamentals
//
// SOLUTION VERSION — all accessibility issues fixed:
//
//   1. Modal.tsx — focus trap, Escape key, ARIA dialog attributes,
//                  focus restored to trigger on close
//   2. Sidebar.tsx — nav has aria-label, NavLink sets aria-current="page"
//   3. TaskStatusButton.tsx — buttons have descriptive aria-label
//   4. App.css — all badge color combinations pass WCAG AA (4.5:1)

import { lazy, Suspense } from 'react'
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
import { TaskList } from './components/TaskList'
import { TaskDetail } from './pages/TaskDetail'
import { NotFoundPage } from './pages/NotFoundPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GlobalErrorFallback } from './components/ErrorFallback'
import { ProjectDetailSkeleton } from './components/skeletons/ProjectDetailSkeleton'
import { FormSkeleton } from './components/skeletons/FormSkeleton'

const ProjectDetailPanel = lazy(() => import('./pages/ProjectDetailPanel'))
const NewProjectPage = lazy(() => import('./pages/NewProjectPage'))

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
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <GlobalErrorFallback error={error} resetError={resetError} />
      )}
      onError={(error, info) => {
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

                      <Route
                        path=":projectId"
                        element={
                          <Suspense fallback={<ProjectDetailSkeleton />}>
                            <ProjectDetailPanel />
                          </Suspense>
                        }
                      >
                        <Route index element={<TaskList />} />
                        <Route path="tasks/:taskId" element={<TaskDetail />} />
                      </Route>
                    </Route>

                    <Route
                      path="/projects/new"
                      element={
                        <Suspense fallback={<FormSkeleton />}>
                          <NewProjectPage />
                        </Suspense>
                      }
                    />
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
