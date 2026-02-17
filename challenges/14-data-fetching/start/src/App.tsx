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
//   - MSW is installed (devDependency) and src/mocks/ is configured
//   - main.tsx needs to be updated to start the MSW worker
//   - ProjectsLayout needs to fetch /api/projects instead of using hardcoded data
//   - ProjectDetailPanel needs to fetch /api/projects/:id instead of hardcoded data
//   - A new useFetch<T> custom hook needs to be created
//   - LoadingSpinner and ErrorMessage components need to be created
//
// Route structure (unchanged from Challenge 13):
//
//   /                          → redirect to /projects
//   <Layout>                   → shell: Header + Sidebar + Outlet + Footer
//     /projects                → ProjectsLayout (master-detail grid)
//       /projects        (idx) → ProjectEmptyState
//       /projects/:projectId   → ProjectDetailPanel
//         :projectId     (idx) → TaskList
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
