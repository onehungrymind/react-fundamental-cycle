import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
// Route structure (Challenge 11 — master-detail):
//
//   /                          → redirect to /projects
//   <Layout>                   → shell: Header + Sidebar + Outlet + Footer
//     /projects                → ProjectsLayout (master-detail grid)
//       /projects        (idx) → ProjectEmptyState ("select a project")
//       /projects/:projectId   → ProjectDetailPanel (project info + Outlet)
//         :projectId     (idx) → TaskList (tasks for selected project)
//         tasks/:taskId        → TaskDetail (single task detail)
//     /projects/new            → NewProjectPage (full page, outside the split)
//   *                          → NotFoundPage (404 catch-all)
//
// Why is /projects/new OUTSIDE ProjectsLayout?
//   The new-project form is a full-page experience, not a panel inside the
//   master-detail layout.  If it were nested under ProjectsLayout the user
//   would see the project list on the left while filling in the form — not
//   what we want.  Placing it as a sibling of ProjectsLayout (still inside
//   Layout) keeps the Header/Sidebar/Footer but replaces the entire main
//   content area with the form.
//
// Why does /projects/new appear before /projects in the route list?
//   React Router v7 uses score-based matching, so order is generally not
//   critical.  But explicitly listing /projects/new before the nested
//   /projects route makes the intent clear: "new" is not a :projectId param.

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect the root to /projects */}
        <Route path="/" element={<Navigate to="/projects" replace />} />

        {/* Layout route: shell renders once, page content swaps via <Outlet /> */}
        <Route element={<Layout />}>

          {/* Master-detail container: always shows the project list on the left */}
          <Route path="/projects" element={<ProjectsLayout />}>
            {/* Index: shown in the right panel when no project is selected */}
            <Route index element={<ProjectEmptyState />} />

            {/* Project detail panel with its own nested routes */}
            <Route path=":projectId" element={<ProjectDetailPanel />}>
              {/* Index: task list shown below project details */}
              <Route index element={<TaskList />} />
              {/* Task detail: replaces task list in the panel's Outlet */}
              <Route path="tasks/:taskId" element={<TaskDetail />} />
            </Route>
          </Route>

          {/* New project form as a full page (not inside the master-detail split) */}
          <Route path="/projects/new" element={<NewProjectPage />} />

        </Route>

        {/* Catch-all: matches any URL not matched above */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
