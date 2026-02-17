// Challenge 25 — Deployment & Production Build
//
// START VERSION — The app is fully functional but has no deployment
// configuration. Your tasks:
//
//   1. Create .env.development and .env.production files with VITE_API_URL
//   2. Update src/api/projects.ts and src/api/tasks.ts to use
//      import.meta.env.VITE_API_URL instead of hardcoded '/api'
//   3. Augment ImportMetaEnv in src/vite-env.d.ts for VITE_API_URL
//   4. Add build config in vite.config.ts (sourcemap + manualChunks)
//   5. Create vercel.json for Vercel SPA fallback
//   6. Create netlify.toml and public/_redirects for Netlify SPA fallback

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
