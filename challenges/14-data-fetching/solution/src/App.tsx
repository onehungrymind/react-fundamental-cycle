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

// Challenge 14 — Data Fetching Fundamentals
//
// Changes from Challenge 13:
//   - main.tsx starts the MSW service worker before rendering
//   - useFetch<T> custom hook handles loading / error / success states
//   - ProjectsLayout fetches /api/projects via useFetch
//   - ProjectDetailPanel fetches /api/projects/:id (includes tasks) via useFetch
//   - ProjectDetailPanel passes fetched tasks to TaskList via Outlet context
//   - TaskList reads the outlet context via useOutletContext
//   - LoadingSpinner and ErrorMessage components are new
//   - src/data/projects.ts and src/data/tasks.ts are removed
//
// Route structure (same as Challenge 13):
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
