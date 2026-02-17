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

// App.tsx owns the entire route configuration.
//
// Challenge 12 changes vs Challenge 11:
//   - <ThemeProvider> wraps the entire tree so useTheme() works anywhere
//   - <AuthProvider> wraps the entire tree so useAuth() works anywhere
//   - Provider order: ThemeProvider outside AuthProvider (arbitrary for these
//     two; neither depends on the other)
//
// Route structure (unchanged from Challenge 11):
//
//   /                          → redirect to /projects
//   <Layout>                   → shell: Header + Sidebar + Outlet + Footer
//     /projects                → ProjectsLayout (master-detail grid)
//       /projects        (idx) → ProjectEmptyState
//       /projects/:projectId   → ProjectDetailPanel
//         :projectId     (idx) → TaskList
//         tasks/:taskId        → TaskDetail
//     /projects/new            → NewProjectPage (full page, outside the split)
//   *                          → NotFoundPage (404 catch-all)

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirect the root to /projects */}
            <Route path="/" element={<Navigate to="/projects" replace />} />

            {/* Layout route: shell renders once, page content swaps via <Outlet /> */}
            <Route element={<Layout />}>

              {/* Master-detail container */}
              <Route path="/projects" element={<ProjectsLayout />}>
                <Route index element={<ProjectEmptyState />} />
                <Route path=":projectId" element={<ProjectDetailPanel />}>
                  <Route index element={<TaskList />} />
                  <Route path="tasks/:taskId" element={<TaskDetail />} />
                </Route>
              </Route>

              {/* New project form as a full page */}
              <Route path="/projects/new" element={<NewProjectPage />} />

            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
