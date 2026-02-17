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

// Challenge 13 — useReducer & Complex State Logic
//
// Route structure (unchanged from Challenge 12):
//
//   /                          → redirect to /projects
//   <Layout>                   → shell: Header + Sidebar + Outlet + Footer
//     /projects                → ProjectsLayout (master-detail grid)
//       /projects        (idx) → ProjectEmptyState
//       /projects/:projectId   → ProjectDetailPanel
//         :projectId     (idx) → TaskList        ← you will wire useReducer here
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
