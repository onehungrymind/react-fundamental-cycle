// Challenge 22 — Testing Async Operations & Mocking
//
// TODO: Write async tests for ProjectsLayout.
//
// ProjectsLayout:
//   - Fetches /api/projects via useProjects()
//   - Renders a loading spinner (role="status") while the request is in flight
//   - Renders the project list once data arrives
//   - Renders an error message (role="alert") + Retry button when the fetch fails
//
// MSW intercepts the fetch.  The default handlers (src/mocks/handlers.ts) return
// the seed data from src/mocks/data.ts.  Per-test error responses are added with:
//
//   server.use(
//     http.get('/api/projects', () => new HttpResponse(null, { status: 500 }))
//   )
//
// After each test, setup.ts calls server.resetHandlers() automatically.
//
// Helpful query methods:
//   screen.getByRole('status')       — synchronous; checks loading spinner is there
//   screen.findByText('...')         — async; waits up to 1 s for text to appear
//   screen.queryByRole('status')     — returns null if not found (no throw)
//   screen.getByRole('button', ...) — synchronous once data has loaded

import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test/utils'
import { ProjectsLayout } from '../ProjectsLayout'

describe('ProjectsLayout', () => {
  describe('loading state', () => {
    it('shows a loading indicator while the fetch is in flight', () => {
      // TODO: Render ProjectsLayout and assert that role="status" is present
      // BEFORE the MSW handler has responded (i.e. synchronously after render).
    })
  })

  describe('success state', () => {
    it('renders project names after a successful fetch', async () => {
      // TODO: Render ProjectsLayout, then use findByText to wait for
      // "Website Redesign" (one of the seed project names).
    })

    it('removes the loading spinner after data arrives', async () => {
      // TODO: Render, wait for a project name, then assert the status role
      // is no longer in the document.
    })
  })

  describe('error state', () => {
    it('shows an error message when the API returns 500', async () => {
      // TODO:
      //   1. Override the handler:  server.use(http.get('/api/projects', ...))
      //   2. Render ProjectsLayout
      //   3. Use findByText to wait for "Something went wrong"
    })

    it('renders a Retry button in the error state', async () => {
      // TODO: Similar to the test above — also assert the Retry button exists.
    })

    it('re-fetches data successfully after the user clicks Retry', async () => {
      // TODO:
      //   1. Override handler to fail on the first call, succeed on the second
      //   2. Render, wait for error state
      //   3. Click Retry button
      //   4. Wait for project data to appear and error to disappear
    })
  })
})
