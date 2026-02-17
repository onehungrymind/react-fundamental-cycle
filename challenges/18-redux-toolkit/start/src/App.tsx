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

// Challenge 18 — State Management: Redux Toolkit (Alternate)
//
// TODO: Import the Redux store and Provider from react-redux
//   import { Provider } from 'react-redux'
//   import { store } from './store/redux/store'
//
// TODO: Wrap the app in <Provider store={store}> so that
//   useAppSelector and useAppDispatch work in every component.
//
// The app currently uses Zustand (same as ch17).
// Once you add the Provider, update the components below to
// use the Redux hooks instead of Zustand selectors.

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
