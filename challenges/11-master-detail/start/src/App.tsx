import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProjectListPage } from './pages/ProjectListPage'
import { NewProjectPage } from './pages/NewProjectPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

// App.tsx owns the entire route configuration.
//
// Current route structure (Challenge 10 starting point):
//   /                    → redirect to /projects
//   <Layout>             → shell: Header + Sidebar + Outlet + Footer
//     /projects          → ProjectListPage (full-page project grid)
//     /projects/new      → NewProjectPage (full-page form)
//     /projects/:projectId → ProjectDetailPage (full-page detail)
//   *                    → NotFoundPage (404 catch-all)
//
// The list and detail are SEPARATE full-page views right now.
// Your challenge: transform this into a master-detail layout where both
// the project list AND the detail are visible side-by-side.
//
// See README.md for the target route structure and step-by-step tasks.

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect the root to /projects */}
        <Route path="/" element={<Navigate to="/projects" replace />} />

        {/* Layout route: shell renders once, page content swaps via <Outlet /> */}
        <Route element={<Layout />}>
          <Route path="/projects"             element={<ProjectListPage />} />
          <Route path="/projects/new"         element={<NewProjectPage />} />
          <Route path="/projects/:projectId"  element={<ProjectDetailPage />} />
        </Route>

        {/* Catch-all: matches any URL not matched above */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
