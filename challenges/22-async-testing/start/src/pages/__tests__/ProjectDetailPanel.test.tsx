// Challenge 22 — Testing Async Operations & Mocking
//
// TODO: Write async tests for ProjectDetailPanel.
//
// ProjectDetailPanel:
//   - Reads :projectId from useParams()
//   - Fetches /api/projects/:id via useProject()
//   - Renders a loading spinner while the request is in flight
//   - Renders the project name and description after success
//   - Renders an error message + Retry button on failure or 404
//
// IMPORTANT — useParams() only works inside a <Route>.
// Use the `path` option in renderWithProviders:
//
//   renderWithProviders(<ProjectDetailPanel />, {
//     route: '/projects/proj-1',
//     path:  '/projects/:projectId',
//   })
//
// This wraps the component in:
//
//   <Routes>
//     <Route path="/projects/:projectId" element={<ProjectDetailPanel />} />
//   </Routes>
//
// which lets useParams() resolve `projectId` from the URL.
//
// The `queryClient` returned by renderWithProviders lets you seed the cache
// so the component renders synchronously without a network round-trip:
//
//   const { queryClient } = renderWithProviders(...)
//   queryClient.setQueryData(['projects', 'proj-1'], myProjectFixture)

import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test/utils'
import { ProjectDetailPanel } from '../ProjectDetailPanel'

describe('ProjectDetailPanel', () => {
  describe('loading state', () => {
    it('shows a loading spinner while the project fetch is in flight', () => {
      // TODO: Render with route '/projects/proj-1' and path '/projects/:projectId'.
      // Assert that role="status" is in the document synchronously.
    })
  })

  describe('success state', () => {
    it('renders the project name after a successful fetch', async () => {
      // TODO: Render and use findByText to wait for "Website Redesign".
    })

    it('removes the spinner after data arrives', async () => {
      // TODO: Wait for data, then assert role="status" is gone.
    })
  })

  describe('error state', () => {
    it('shows an error message when the API returns 500', async () => {
      // TODO:
      //   1. server.use(http.get('/api/projects/:id', () => new HttpResponse(null, { status: 500 })))
      //   2. Render the component
      //   3. findByText(/something went wrong/i)
    })

    it('shows an error message when the project is not found (404)', async () => {
      // TODO: Override with 404 and route to a non-existent project id.
    })

    it('renders a Retry button in the error state', async () => {
      // TODO: After asserting the error message, check for a Retry button.
    })
  })
})
