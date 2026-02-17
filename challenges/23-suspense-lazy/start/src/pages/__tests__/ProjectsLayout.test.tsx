// Challenge 22 — Testing Async Operations & Mocking
//
// Async tests for ProjectsLayout.
//
// ProjectsLayout fetches /api/projects via useProjects() and renders:
//   - A loading spinner (role="status") while the request is in flight
//   - The project list once data arrives
//   - An error message + retry button when the request fails
//
// MSW intercepts the fetch inside jsdom.  The default handlers in
// src/mocks/handlers.ts return the seed projects from src/mocks/data.ts.
// Per-test overrides are added with server.use() and automatically removed
// by the afterEach(() => server.resetHandlers()) hook in setup.ts.
//
// Key async helpers:
//   findByRole / findByText — wait for an element to appear (up to 1 s default)
//   waitFor                 — poll an arbitrary assertion until it passes
//   queryByRole             — returns null if absent (no throw); useful for
//                             asserting an element is NOT in the DOM

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test/utils'
import { ProjectsLayout } from '../ProjectsLayout'

// ProjectsLayout renders an <Outlet /> for the detail panel.  In tests we
// don't need a real outlet — the component itself is what we are testing.
// We render it directly; the Outlet renders nothing (no nested Route match).

describe('ProjectsLayout', () => {
  describe('loading state', () => {
    it('shows a loading indicator while the fetch is in flight', () => {
      // Render — the query fires but MSW has not responded yet.
      renderWithProviders(<ProjectsLayout />)

      // The LoadingSpinner has role="status".  It should be present before
      // MSW resolves the handler.
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('success state', () => {
    it('renders project names after a successful fetch', async () => {
      renderWithProviders(<ProjectsLayout />)

      // findByText waits (up to 1 s) for the text to appear.
      // MSW responds with the seed data which includes "Website Redesign".
      await screen.findByText('Website Redesign')

      // Verify a second project is also rendered
      expect(screen.getByText('Mobile App MVP')).toBeInTheDocument()
    })

    it('removes the loading spinner after data arrives', async () => {
      renderWithProviders(<ProjectsLayout />)

      // Wait for the data to load
      await screen.findByText('Website Redesign')

      // The spinner should be gone
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('renders all five seed projects', async () => {
      renderWithProviders(<ProjectsLayout />)

      await screen.findByText('Website Redesign')

      expect(screen.getByText('Mobile App MVP')).toBeInTheDocument()
      expect(screen.getByText('API Migration')).toBeInTheDocument()
      expect(screen.getByText('Design System')).toBeInTheDocument()
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    })
  })

  describe('error state', () => {
    it('shows an error message when the API returns 500', async () => {
      // Override the default GET /api/projects handler for this test only.
      // server.resetHandlers() in afterEach removes this override automatically.
      server.use(
        http.get('/api/projects', () => {
          return new HttpResponse(null, { status: 500 })
        }),
      )

      renderWithProviders(<ProjectsLayout />)

      // ErrorMessage renders role="alert" with "Something went wrong"
      await screen.findByText(/something went wrong/i)
    })

    it('shows the error text from the thrown Error', async () => {
      server.use(
        http.get('/api/projects', () => {
          return new HttpResponse(null, { status: 500 })
        }),
      )

      renderWithProviders(<ProjectsLayout />)

      // The API throws `Failed to fetch projects: 500`
      await screen.findByText(/failed to fetch projects/i)
    })

    it('renders a Retry button in the error state', async () => {
      server.use(
        http.get('/api/projects', () => {
          return new HttpResponse(null, { status: 500 })
        }),
      )

      renderWithProviders(<ProjectsLayout />)

      await screen.findByText(/something went wrong/i)

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('re-fetches data successfully after the user clicks Retry', async () => {
      const user = userEvent.setup()
      let callCount = 0

      // First call fails; second call succeeds with a minimal project list.
      server.use(
        http.get('/api/projects', () => {
          callCount += 1
          if (callCount === 1) {
            return new HttpResponse(null, { status: 500 })
          }
          return HttpResponse.json([
            {
              id: 'proj-1',
              name: 'Website Redesign',
              description: 'A project',
              status: 'active',
              taskCount: 3,
              createdBy: 'tm-1',
              createdAt: '2025-01-10T09:00:00Z',
            },
          ])
        }),
      )

      renderWithProviders(<ProjectsLayout />)

      // Wait for the error state
      await screen.findByText(/something went wrong/i)

      // Click Retry — the second request should succeed
      await user.click(screen.getByRole('button', { name: /retry/i }))

      // After the successful refetch the project name should appear
      await screen.findByText('Website Redesign')

      await waitFor(() => {
        expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
      })
    })
  })
})
