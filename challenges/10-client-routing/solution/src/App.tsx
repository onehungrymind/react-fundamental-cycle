import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProjectListPage } from './pages/ProjectListPage'
import { NewProjectPage } from './pages/NewProjectPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

// App.tsx owns the entire route configuration.
//
// Route structure:
//   /                    → redirect to /projects (Navigate)
//   <Layout>             → layout route: renders Header + Sidebar + Outlet + Footer
//     /projects          → ProjectListPage (filter bar + project grid)
//     /projects/new      → NewProjectPage  (form as a full page)
//     /projects/:projectId → ProjectDetailPage (reads ID from URL)
//   *                    → NotFoundPage (404 catch-all)
//
// The layout route has no `path` — React Router renders it as a wrapper for its
// children.  <Outlet /> inside Layout is where the matched child renders.
//
// Note: /projects/new must be listed BEFORE /projects/:projectId so React Router
// matches the literal segment "new" before attempting to parse it as a param.

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect the root to /projects */}
        <Route path="/" element={<Navigate to="/projects" replace />} />

        {/* Layout route: shell renders once, page content swaps via <Outlet /> */}
        <Route element={<Layout />}>
          <Route path="/projects"            element={<ProjectListPage />} />
          <Route path="/projects/new"        element={<NewProjectPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        </Route>

        {/* Catch-all: matches any URL not matched above */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
