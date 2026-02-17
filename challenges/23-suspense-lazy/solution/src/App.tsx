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

// Challenge 23 — Suspense & Lazy Loading
//
// This is the SOLUTION version.
//
// Changes from start/:
//
//   ProjectDetailPanel and NewProjectPage are now lazy-loaded with React.lazy.
//   Each is wrapped with a <Suspense> boundary that shows a skeleton fallback
//   while the chunk is being downloaded and parsed.
//
//   New files:
//     src/components/skeletons/ProjectDetailSkeleton.tsx  (NEW)
//     src/components/skeletons/FormSkeleton.tsx           (NEW)
//     src/components/skeletons/PageSkeleton.tsx           (NEW)
//
//   ProjectsLayout stays eagerly loaded — it is the first thing rendered after
//   the initial redirect and splitting it would add a Suspense flash on every
//   page load with no benefit.
//
// React.lazy requires the module to have a default export.
// Both pages already export `export default PageName` from ch22.
//
// Run: npm run dev
// Build: npm run build   (look for separate chunk files in dist/assets/)

// Lazy-loaded pages — each becomes a separate JS chunk in the build output
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

                      {/* ProjectDetailPanel is lazy — show a skeleton while the
                          chunk loads.  The skeleton mirrors the panel layout:
                          title bar, meta row, and a list of task card shapes. */}
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

                    {/* NewProjectPage is lazy — show a form-shaped skeleton. */}
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
