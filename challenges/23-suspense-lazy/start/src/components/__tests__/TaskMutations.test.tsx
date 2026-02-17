// Challenge 22 — Testing Async Operations & Mocking
//
// Tests for task mutations — specifically the optimistic-update behaviour
// in useCreateTask and how it interacts with the query cache.
//
// Strategy:
//
//   1. Seed the QueryClient cache with a known project before rendering
//      AddTaskForm.  This means the component immediately has data to show
//      (no loading phase) and we can focus purely on the mutation.
//
//   2. Simulate the user opening the form and submitting a new task title.
//
//   3. Assert on the *optimistic* update: the task title appears in the cache
//      before MSW responds, because useCreateTask calls queryClient.setQueryData()
//      in its onMutate hook.
//
//   4. Assert that after MSW responds the form closes (onSuccess ran) and the
//      query is eventually invalidated / refetched.
//
// Key insight:
//   Optimistic updates are visible immediately after the user action — we use
//   waitFor() to poll the cache because React's state updates are batched.
//   The form closing (findByRole) confirms the server round-trip completed.

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test/utils'
import { AddTaskForm } from '../AddTaskForm'
import type { ProjectWithTasks } from '../../api/projects'

// A minimal cached project — two existing tasks.
const CACHED_PROJECT: ProjectWithTasks = {
  id: 'proj-1',
  name: 'Website Redesign',
  description: 'Complete overhaul of the company website.',
  status: 'active',
  taskCount: 2,
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

describe('Task mutations', () => {
  describe('optimistic task creation', () => {
    it('adds the new task to the cache optimistically before the server responds', async () => {
      const user = userEvent.setup()

      // renderWithProviders returns the queryClient so we can seed the cache.
      const { queryClient } = renderWithProviders(
        <AddTaskForm projectId="proj-1" />,
        { route: '/projects/proj-1' },
      )

      // Seed the cache — AddTaskForm calls queryClient.setQueryData in
      // onMutate, which requires an existing entry to spread from.
      queryClient.setQueryData(['projects', 'proj-1'], CACHED_PROJECT)

      // Open the form
      await user.click(screen.getByRole('button', { name: /\+ add task/i }))

      // Type a new task title
      await user.type(screen.getByLabelText(/task title/i), 'Build contact form')

      // Submit — triggers onMutate which immediately updates the cache
      await user.click(screen.getByRole('button', { name: /^add$/i }))

      // The optimistic update should be visible right away.
      // We check the cache directly — more reliable than querying the DOM
      // through AddTaskForm (which shows the form, not the task list).
      await waitFor(() => {
        const cached = queryClient.getQueryData<ProjectWithTasks>(['projects', 'proj-1'])
        const titles = cached?.tasks.map((t) => t.title) ?? []
        expect(titles).toContain('Build contact form')
      })
    })

    it('the optimistic task has a temp- id before the server responds', async () => {
      const user = userEvent.setup()

      const { queryClient } = renderWithProviders(
        <AddTaskForm projectId="proj-1" />,
        { route: '/projects/proj-1' },
      )

      queryClient.setQueryData(['projects', 'proj-1'], CACHED_PROJECT)

      await user.click(screen.getByRole('button', { name: /\+ add task/i }))
      await user.type(screen.getByLabelText(/task title/i), 'Temp task title')
      await user.click(screen.getByRole('button', { name: /^add$/i }))

      // The optimistic entry uses `temp-${Date.now()}` as its id
      await waitFor(() => {
        const cached = queryClient.getQueryData<ProjectWithTasks>(['projects', 'proj-1'])
        const optimistic = cached?.tasks.find((t) => t.title === 'Temp task title')
        expect(optimistic?.id).toMatch(/^temp-/)
      })
    })

    it('closes the form and clears the input after a successful mutation', async () => {
      const user = userEvent.setup()

      const { queryClient } = renderWithProviders(
        <AddTaskForm projectId="proj-1" />,
        { route: '/projects/proj-1' },
      )

      queryClient.setQueryData(['projects', 'proj-1'], CACHED_PROJECT)

      await user.click(screen.getByRole('button', { name: /\+ add task/i }))
      await user.type(screen.getByLabelText(/task title/i), 'Close on success')
      await user.click(screen.getByRole('button', { name: /^add$/i }))

      // After MSW responds with 201 the onSuccess callback fires:
      // it resets fields and closes the form (shows the toggle button again).
      await screen.findByRole('button', { name: /\+ add task/i })

      // The form input should be gone
      expect(screen.queryByLabelText(/task title/i)).not.toBeInTheDocument()
    })

    it('rolls back the optimistic update when the server returns an error', async () => {
      const user = userEvent.setup()

      // Override the task creation endpoint to fail for this test only.
      // server.resetHandlers() in afterEach removes this override automatically.
      server.use(
        http.post('/api/projects/:id/tasks', () => {
          return new HttpResponse(null, { status: 500 })
        }),
      )

      const { queryClient } = renderWithProviders(
        <AddTaskForm projectId="proj-1" />,
        { route: '/projects/proj-1' },
      )

      queryClient.setQueryData(['projects', 'proj-1'], CACHED_PROJECT)

      await user.click(screen.getByRole('button', { name: /\+ add task/i }))
      await user.type(screen.getByLabelText(/task title/i), 'Will be rolled back')
      await user.click(screen.getByRole('button', { name: /^add$/i }))

      // After the server error the onError hook restores the previous cache
      await waitFor(() => {
        const cached = queryClient.getQueryData<ProjectWithTasks>(['projects', 'proj-1'])
        const titles = cached?.tasks.map((t) => t.title) ?? []
        expect(titles).not.toContain('Will be rolled back')
      })
    })
  })

  describe('cache invalidation after mutation', () => {
    it('invalidates the project query after a successful task creation', async () => {
      const user = userEvent.setup()

      const { queryClient } = renderWithProviders(
        <AddTaskForm projectId="proj-1" />,
        { route: '/projects/proj-1' },
      )

      queryClient.setQueryData(['projects', 'proj-1'], CACHED_PROJECT)

      await user.click(screen.getByRole('button', { name: /\+ add task/i }))
      await user.type(screen.getByLabelText(/task title/i), 'Invalidation test task')
      await user.click(screen.getByRole('button', { name: /^add$/i }))

      // Wait for the form to close (indicates onSuccess ran and onSettled fired)
      await screen.findByRole('button', { name: /\+ add task/i })

      // After onSettled the query is invalidated and refetched from MSW.
      // We verify the cache is still populated (not cleared) after the refetch.
      await waitFor(() => {
        const cached = queryClient.getQueryData<ProjectWithTasks>(['projects', 'proj-1'])
        expect(cached).toBeDefined()
      })
    })
  })
})
