import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
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

// Challenge 15 — Server State with TanStack Query
//
// Changes from Challenge 14:
//   - QueryClient configured with sensible defaults (staleTime, gcTime)
//   - QueryClientProvider wraps the entire app tree
//   - ReactQueryDevtools included for cache inspection
//   - ProjectsLayout uses useProjects() instead of useFetch<Project[]>
//   - ProjectDetailPanel uses useProject(projectId) instead of useFetch
//   - src/api/projects.ts: typed fetch functions
//   - src/hooks/queries/: query hook wrappers
//   - useFetch.ts removed (no longer needed)
//
// Route structure (unchanged from Challenge 14):
//
//   /                          → redirect to /projects
//   <Layout>                   → shell: Header + Sidebar + Outlet + Footer
//     /projects                → ProjectsLayout (master-detail grid)
//       /projects        (idx) → ProjectEmptyState
//       /projects/:projectId   → ProjectDetailPanel (fetches project + tasks)
//         :projectId     (idx) → TaskList (reads tasks from outlet context)
//         tasks/:taskId        → TaskDetail
//     /projects/new            → NewProjectPage
//   *                          → NotFoundPage (404 catch-all)

// Create the QueryClient once at module level so it persists across
// React re-renders.  Creating it inside the component would reset the
// entire cache on every render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30 seconds.  Within this window,
      // navigating to a page that was already visited shows cached data
      // instantly without a loading spinner.
      staleTime: 30_000,
      // Unused cache entries are kept in memory for 5 minutes after the
      // last subscriber unmounts.  This handles the common "navigate away
      // and quickly come back" scenario.
      gcTime: 5 * 60 * 1000,
    },
  },
})

export function App() {
  return (
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
      {/* DevTools renders a floating button in the bottom-right corner.
          It is automatically excluded from production builds. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
