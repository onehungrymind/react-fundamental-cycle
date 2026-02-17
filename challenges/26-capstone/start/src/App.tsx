// Challenge 26 — THE CAPSTONE: Putting It All Together
//
// This is your starting point. Three features need to be implemented:
//
//   Feature 1: Team Member Assignment
//     - Create src/components/TeamMemberSelect.tsx
//     - Create src/hooks/queries/useTeam.ts
//     - Update TaskItem to use TeamMemberSelect instead of TaskAssignment
//
//   Feature 2: Project Dashboard
//     - Create src/pages/DashboardPage.tsx (lazy-loaded)
//     - Create src/components/StatCard.tsx
//     - TODO: add /dashboard route below
//     - TODO: change the / redirect to /dashboard
//     - Update Layout.tsx to add Dashboard nav link
//
//   Feature 3: Real-Time Polling
//     - Update src/hooks/queries/useProjects.ts (add refetchInterval)
//     - Create src/components/SyncIndicator.tsx
//     - Update Header.tsx to render SyncIndicator

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

// TODO Feature 2: Lazy-load DashboardPage here
// const DashboardPage = lazy(() => import('./pages/DashboardPage'))

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
                  {/* TODO Feature 2: change redirect target to /dashboard */}
                  <Route path="/" element={<Navigate to="/projects" replace />} />

                  <Route element={<Layout />}>
                    {/* TODO Feature 2: add /dashboard route here
                    <Route
                      path="/dashboard"
                      element={
                        <Suspense fallback={<PageSkeleton />}>
                          <DashboardPage />
                        </Suspense>
                      }
                    />
                    */}

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
