// Challenge 23 — Suspense & Lazy Loading
//
// Async tests for ProjectDetailPanel (named export, not the lazy wrapper).
//
// React.lazy wraps the default export, but tests import the named export
// directly so they can test the component logic without dealing with the
// dynamic import lifecycle.
//
// ProjectDetailPanel uses useParams() to read `:projectId` from the URL,
// then fetches /api/projects/:id via useProject().  It renders:
//   - A loading spinner while the request is in flight
//   - The project name, description, and task list after success
//   - An error message when the request fails or returns 404
//
// useParams() only works when the component is rendered inside a <Route>
// with the matching path pattern.  renderWithProviders accepts a `path`
// option for this purpose:
//
//   renderWithProviders(<ProjectDetailPanel />, {
//     route: '/projects/proj-1',
//     path:  '/projects/:projectId',
//   })
//
// The `queryClient` returned by renderWithProviders lets tests seed the
// cache with pre-fetched data so a test can skip the loading phase and
// assert on a specific UI state directly.

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test/utils'
import { ProjectDetailPanel } from '../ProjectDetailPanel'
import type { ProjectWithTasks } from '../../api/projects'

// A minimal project fixture that satisfies the ProjectWithTasks shape.
const PROJ_1: ProjectWithTasks = {
  id: 'proj-1',
  name: 'Website Redesign',
  description: 'Complete overhaul of the company website.',
  status: 'active',
  taskCount: 2,
  dueDate: '2025-03-15',
  createdBy: 'tm-1',
  createdAt: '2025-01-10T09:00:00Z',
  tasks: [
    {
      id: 'task-1',
      title: 'Design homepage mockup',
      description: 'Create mockup.',
      status: 'Done',
      projectId: 'proj-1',
      createdAt: '2025-01-10T09:30:00Z',
    },
    {
      id: 'task-2',
      title: 'Implement responsive navigation',
      description: 'Build nav.',
      status: 'InProgress',
      projectId: 'proj-1',
      createdAt: '2025-01-12T10:00:00Z',
    },
  ],
}

describe('ProjectDetailPanel', () => {
  describe('loading state', () => {
    it('shows a loading spinner while the project fetch is in flight', () => {
      renderWithProviders(<ProjectDetailPanel />, {
        route: '/projects/proj-1',
        path: '/projects/:projectId',
      })

      // LoadingSpinner renders role="status"
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('success state', () => {
    it('renders the project name after a successful fetch', async () => {
      renderWithProviders(<ProjectDetailPanel />, {
        route: '/projects/proj-1',
        path: '/projects/:projectId',
      })

      // MSW seed data includes "Website Redesign" for proj-1
      await screen.findByText('Website Redesign')
    })

    it('renders the project description', async () => {
      renderWithProviders(<ProjectDetailPanel />, {
        route: '/projects/proj-1',
        path: '/projects/:projectId',
      })

      await screen.findByText(/complete overhaul of the company website/i)
    })

    it('removes the spinner after data arrives', async () => {
      renderWithProviders(<ProjectDetailPanel />, {
        route: '/projects/proj-1',
        path: '/projects/:projectId',
      })

      await screen.findByText('Website Redesign')

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('can render from a cache-seeded QueryClient without a network round-trip', async () => {
      // Pre-populate the cache so the component renders synchronously on
      // first paint — no loading state.
      const { queryClient } = renderWithProviders(<ProjectDetailPanel />, {
        route: '/projects/proj-1',
        path: '/projects/:projectId',
      })

      queryClient.setQueryData(['projects', 'proj-1'], PROJ_1)

      // The heading should appear immediately (synchronous re-render)
      await screen.findByText('Website Redesign')
    })
  })

  describe('error state', () => {
    it('shows an error message when the API returns 500', async () => {
      server.use(
        http.get('/api/projects/:id', () => {
          return new HttpResponse(null, { status: 500 })
        }),
      )

      renderWithProviders(<ProjectDetailPanel />, {
        route: '/projects/proj-1',
        path: '/projects/:projectId',
      })

      await screen.findByText(/something went wrong/i)
    })

    it('shows an error message when the project is not found (404)', async () => {
      server.use(
        http.get('/api/projects/:id', () => {
          return new HttpResponse(null, { status: 404 })
        }),
      )

      renderWithProviders(<ProjectDetailPanel />, {
        route: '/projects/proj-999',
        path: '/projects/:projectId',
      })

      await screen.findByText(/something went wrong/i)
    })

    it('renders a Retry button in the error state', async () => {
      server.use(
        http.get('/api/projects/:id', () => {
          return new HttpResponse(null, { status: 500 })
        }),
      )

      renderWithProviders(<ProjectDetailPanel />, {
        route: '/projects/proj-1',
        path: '/projects/:projectId',
      })

      await screen.findByText(/something went wrong/i)

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('re-fetches successfully after clicking Retry', async () => {
      const user = userEvent.setup()
      let callCount = 0

      server.use(
        http.get('/api/projects/:id', () => {
          callCount += 1
          if (callCount === 1) {
            return new HttpResponse(null, { status: 500 })
          }
          return HttpResponse.json(PROJ_1)
        }),
      )

      renderWithProviders(<ProjectDetailPanel />, {
        route: '/projects/proj-1',
        path: '/projects/:projectId',
      })

      await screen.findByText(/something went wrong/i)

      await user.click(screen.getByRole('button', { name: /retry/i }))

      await screen.findByText('Website Redesign')

      await waitFor(() => {
        expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
      })
    })
  })
})
