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
// This is the START version — it has an intentional performance problem.
//
// How to observe the problem:
//   1. Navigate to "Website Redesign" (proj-1) — it has 12 tasks
//   2. Open React DevTools → Profiler tab → record
//   3. Type in the Search tasks input
//   4. Stop recording and inspect the flame graph
//   5. Every TaskItem bar will be highlighted on every keystroke
//
// Your job is to fix this by:
//   - Wrapping TaskItem in React.memo
//   - Adding useCallback to handler functions passed as props
//   - Adding useMemo to the filtered task list computation
//
// See README.md for step-by-step instructions.

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
