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

// Challenge 19 — Performance: React.memo, useMemo, useCallback
//
// This is the SOLUTION version.
//
// Key changes from start/:
//
//   src/components/TaskItem.tsx
//     - Wrapped in React.memo (named function form)
//     - Props refactored: receives onStatusChange, onAssign, onDelete
//       instead of calling mutation hooks directly
//
//   src/components/TaskList.tsx
//     - useCallback on handleStatusChange, handleAssign, handleDelete
//     - useMemo on filteredTasks
//     - Mutations lifted up from TaskItem into TaskList
//
//   src/components/TaskStatusButton.tsx
//     - Receives onStatusChange prop instead of calling useUpdateTask
//
//   src/components/TaskAssignment.tsx
//     - Receives onAssign prop instead of calling useUpdateTask
//
//   src/components/TaskSearchInput.tsx  (NEW)
//     - Extracted search input as a separate focused component
//
// Re-profile after these changes:
//   1. Navigate to Website Redesign (12 tasks)
//   2. Open Profiler → record
//   3. Type in the search input
//   4. TaskItem bars should be absent or very short for unchanged items

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
