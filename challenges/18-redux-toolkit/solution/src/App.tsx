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

// Challenge 18 — State Management: Redux Toolkit (Alternate)
//
// New files:
//   src/store/redux/store.ts               — configureStore
//   src/store/redux/sidebarSlice.ts        — toggle/collapse/expand
//   src/store/redux/filtersSlice.ts        — setStatusFilter/setSortOrder
//   src/store/redux/recentlyViewedSlice.ts — addRecentlyViewed (last 5, no dupes)
//   src/store/redux/hooks.ts               — useAppSelector / useAppDispatch
//
// Updated files:
//   App.tsx            — wrapped with <Provider store={store}>
//   Layout.tsx         — useAppSelector(sidebar) + useAppDispatch(toggle)
//   ProjectsLayout.tsx — useAppSelector(filters) + useAppDispatch
//   ProjectDetailPanel.tsx — useAppDispatch + addRecentlyViewed

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
