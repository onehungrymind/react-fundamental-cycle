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

// Challenge 16 — Mutations & Optimistic Updates
//
// Starting from Challenge 15's solution. All reads use TanStack Query.
// Writes (create task, update status, assign, delete) still use useReducer.
//
// Your goal:
//   1. Create src/api/tasks.ts with createTask, updateTask, deleteTask
//   2. Create src/hooks/mutations/useCreateTask.ts with optimistic onMutate
//   3. Create src/hooks/mutations/useUpdateTask.ts with optimistic onMutate
//   4. Create src/hooks/mutations/useDeleteTask.ts with undo toast
//   5. Update TaskList, TaskItem, TaskStatusButton, TaskAssignment, AddTaskForm
//      to use mutation hooks instead of dispatch
//   6. Remove src/reducers/taskReducer.ts

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
  )
}

export default App
