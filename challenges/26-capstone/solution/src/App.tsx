// Challenge 26 — THE CAPSTONE: Putting It All Together
//
// New in this challenge:
//   Feature 1: TeamMemberSelect — searchable combobox in TaskItem
//              src/components/TeamMemberSelect.tsx
//              src/hooks/queries/useTeam.ts
//
//   Feature 2: Project Dashboard — /dashboard route (lazy loaded)
//              src/pages/DashboardPage.tsx
//              src/components/StatCard.tsx
//              / now redirects to /dashboard instead of /projects
//              Dashboard link added to Sidebar via Layout.tsx
//
//   Feature 3: Real-Time Polling — refetchInterval on useProjects
//              src/hooks/queries/useProjects.ts (refetchInterval: 30_000)
//              src/components/SyncIndicator.tsx
//              src/components/Header.tsx (renders SyncIndicator)

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
import { PageSkeleton } from './components/skeletons/PageSkeleton'

const ProjectDetailPanel = lazy(() => import('./pages/ProjectDetailPanel'))
const NewProjectPage = lazy(() => import('./pages/NewProjectPage'))
// Feature 2: DashboardPage is lazy-loaded
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

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
                  {/* Feature 2: / now redirects to /dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />

                  <Route element={<Layout />}>
                    {/* Feature 2: Dashboard route */}
                    <Route
                      path="/dashboard"
                      element={
                        <Suspense fallback={<PageSkeleton />}>
                          <DashboardPage />
                        </Suspense>
                      }
                    />

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
