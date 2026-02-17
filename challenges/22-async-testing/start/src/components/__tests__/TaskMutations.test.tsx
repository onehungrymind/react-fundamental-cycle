// Challenge 22 — Testing Async Operations & Mocking
//
// TODO: Write tests for the task creation mutation and optimistic updates.
//
// AddTaskForm uses useCreateTask(projectId), which:
//   - On submit, calls queryClient.cancelQueries then sets optimistic data
//     in onMutate (the new task appears immediately with a `temp-` id)
//   - On success, closes the form and clears the input
//   - On error, rolls back the optimistic data via onError
//   - On settled, invalidates the project query so it refetches
//
// Test strategy:
//
//   1. Use renderWithProviders to get back the queryClient
//   2. Call queryClient.setQueryData(['projects', 'proj-1'], myProjectFixture)
//      BEFORE rendering — this lets the mutation's onMutate find existing data
//      to spread from, so the optimistic update works.
//   3. Open the form, type a title, click Add
//   4. Assert optimistically — check the cache directly with queryClient.getQueryData()
//      rather than looking at AddTaskForm's DOM (it renders the form, not the task list).
//   5. Wait for the form to close (findByRole('button', { name: /\+ add task/i }))
//      to confirm the mutation succeeded.
//
// The queryClient return value from renderWithProviders is key here.
// Complete the TODO in src/test/utils.tsx first!

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils'
import { AddTaskForm } from '../AddTaskForm'
import type { ProjectWithTasks } from '../../api/projects'

// Minimal project fixture to seed the query cache.
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
      // TODO:
      //   1. const { queryClient } = renderWithProviders(<AddTaskForm projectId="proj-1" />, ...)
      //   2. queryClient.setQueryData(['projects', 'proj-1'], CACHED_PROJECT)
      //   3. Open the form, type a title, click Add
      //   4. waitFor(() => {
      //        const cached = queryClient.getQueryData(['projects', 'proj-1'])
      //        // assert the new task title is in cached.tasks
      //      })
    })

    it('the optimistic task has a temp- id before the server responds', async () => {
      // TODO: Same setup as above, but also assert that the optimistic entry
      // has an id that starts with "temp-".
    })

    it('closes the form after a successful mutation', async () => {
      // TODO: After clicking Add, use findByRole to wait for the
      // "+ Add task" toggle button to reappear (form closes on success).
    })
  })
})
