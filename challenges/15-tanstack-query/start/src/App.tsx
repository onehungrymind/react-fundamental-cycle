import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

// Challenge 15 — TanStack Query
//
// Starting point: the app uses the custom useFetch hook from Challenge 14.
// Your job is to migrate it to TanStack Query.
//
// TODO 1: Import QueryClient and QueryClientProvider from '@tanstack/react-query'
// TODO 2: Import ReactQueryDevtools from '@tanstack/react-query-devtools'
// TODO 3: Create a QueryClient instance with:
//           defaultOptions.queries.staleTime = 30_000
//           defaultOptions.queries.gcTime = 5 * 60 * 1000
// TODO 4: Wrap the JSX tree with QueryClientProvider (outermost)
// TODO 5: Add <ReactQueryDevtools /> as a sibling of the router providers
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

export function App() {
  return (
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
  )
}

export default App
