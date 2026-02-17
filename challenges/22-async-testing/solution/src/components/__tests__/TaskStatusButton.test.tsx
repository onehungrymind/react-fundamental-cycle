// Challenge 21 — Unit Testing
//
// Tests for TaskStatusButton.
//
// TaskStatusButton renders buttons for each valid next status.
// The valid transitions are:
//   Todo       → InProgress
//   InProgress → InReview
//   InReview   → Done, InProgress
//   Done       → (nothing — returns null)
//
// Key concepts exercised:
//   - queryBy for asserting elements are NOT in the DOM
//   - vi.fn() mocks for callback assertions
//   - userEvent for simulating real click events

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils'
import { TaskStatusButton } from '../TaskStatusButton'
import type { Task } from '../../types'

// Factory to build minimal Task objects for testing
function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Test Task',
    description: 'A test task',
    status: 'Todo',
    projectId: 'proj-1',
    createdAt: '2025-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('TaskStatusButton', () => {
  describe('Todo task', () => {
    it('renders the "In Progress" transition button', () => {
      const task = makeTask({ status: 'Todo' })
      renderWithProviders(
        <TaskStatusButton task={task} onStatusChange={() => {}} />,
      )

      expect(
        screen.getByRole('button', { name: /in progress/i }),
      ).toBeInTheDocument()
    })

    it('does not render an "In Review" button', () => {
      const task = makeTask({ status: 'Todo' })
      renderWithProviders(
        <TaskStatusButton task={task} onStatusChange={() => {}} />,
      )

      expect(
        screen.queryByRole('button', { name: /in review/i }),
      ).not.toBeInTheDocument()
    })

    it('calls onStatusChange with (taskId, "InProgress") when clicked', async () => {
      const user = userEvent.setup()
      const onStatusChange = vi.fn()
      const task = makeTask({ id: 'task-42', status: 'Todo' })

      renderWithProviders(
        <TaskStatusButton task={task} onStatusChange={onStatusChange} />,
      )

      await user.click(screen.getByRole('button', { name: /in progress/i }))

      expect(onStatusChange).toHaveBeenCalledTimes(1)
      expect(onStatusChange).toHaveBeenCalledWith('task-42', 'InProgress', undefined)
    })
  })

  describe('InProgress task', () => {
    it('renders the "In Review" transition button', () => {
      const task = makeTask({ status: 'InProgress' })
      renderWithProviders(
        <TaskStatusButton task={task} onStatusChange={() => {}} />,
      )

      expect(
        screen.getByRole('button', { name: /in review/i }),
      ).toBeInTheDocument()
    })

    it('does not render an "In Progress" button (already there)', () => {
      const task = makeTask({ status: 'InProgress' })
      renderWithProviders(
        <TaskStatusButton task={task} onStatusChange={() => {}} />,
      )

      expect(
        screen.queryByRole('button', { name: /in progress/i }),
      ).not.toBeInTheDocument()
    })
  })

  describe('InReview task', () => {
    it('renders both "Done" and "In Progress" buttons', () => {
      const task = makeTask({ status: 'InReview' })
      renderWithProviders(
        <TaskStatusButton task={task} onStatusChange={() => {}} />,
      )

      expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /in progress/i }),
      ).toBeInTheDocument()
    })

    it('calls onStatusChange with completedAt when moving to Done', async () => {
      const user = userEvent.setup()
      const onStatusChange = vi.fn()
      const task = makeTask({ id: 'task-99', status: 'InReview' })

      renderWithProviders(
        <TaskStatusButton task={task} onStatusChange={onStatusChange} />,
      )

      await user.click(screen.getByRole('button', { name: /done/i }))

      expect(onStatusChange).toHaveBeenCalledTimes(1)
      // Third argument (completedAt) is an ISO string when status is Done
      const [taskId, newStatus, completedAt] = onStatusChange.mock.calls[0] as [
        string,
        string,
        string | undefined,
      ]
      expect(taskId).toBe('task-99')
      expect(newStatus).toBe('Done')
      expect(typeof completedAt).toBe('string')
    })
  })

  describe('Done task', () => {
    it('renders nothing (no buttons)', () => {
      const task = makeTask({ status: 'Done' })
      const { container } = renderWithProviders(
        <TaskStatusButton task={task} onStatusChange={() => {}} />,
      )

      // No buttons should be rendered at all
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      // The container should be essentially empty (React fragment returns null)
      expect(container.firstChild).toBeNull()
    })
  })
})
