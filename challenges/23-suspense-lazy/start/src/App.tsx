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

// Challenge 23 — Suspense & Lazy Loading
//
// This is the START version.
//
// Everything loads eagerly — no React.lazy, no Suspense boundaries,
// no skeleton components.
//
// Your tasks:
//
//   1. Replace the eager imports for ProjectDetailPanel and NewProjectPage
//      with React.lazy(() => import(...)) calls.
//
//   2. Create skeleton components in src/components/skeletons/:
//        ProjectDetailSkeleton.tsx
//        FormSkeleton.tsx
//        PageSkeleton.tsx
//
//   3. Wrap the lazy routes in <Suspense fallback={<SkeletonComponent />}>.
//
//   4. Run `npm run build` and compare the output chunks before/after.
//
// Run: npm run dev

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
