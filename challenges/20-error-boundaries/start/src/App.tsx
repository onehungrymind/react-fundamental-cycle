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

// Challenge 20 — Error Boundaries
//
// This is the START version.
//
// Problem: there are NO error boundaries anywhere in this tree.
// If ANY component throws during render, the entire app crashes
// to a blank white screen with no recovery path.
//
// Your task: add ErrorBoundary components so that:
//   1. The entire app is wrapped in a global ErrorBoundary (last resort)
//   2. The project list sidebar is isolated in its own boundary
//   3. The project detail panel is isolated in its own boundary
//   4. The task form section is isolated in its own boundary
//
// Each fallback should show the error message, a "Try Again" button,
// and a "Report Issue" link.  The global boundary should offer a
// "Reload Application" button that calls window.location.reload().
//
// TODO: Wrap the entire app (below) in a global ErrorBoundary
//       that uses GlobalErrorFallback.

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
    // TODO: Add global ErrorBoundary here
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
  )
}

export default App
