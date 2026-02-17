// Challenge 21 — Unit Testing
//
// Tests for TaskItem.
//
// TaskItem is a memo'd component that receives the task object and all
// callbacks as props (lifted from TaskList).  This design makes it easy
// to test in isolation: just pass a task fixture and vi.fn() callbacks.
//
// Key concepts:
//   - Named-function memo components (TaskItem has a displayName)
//   - Querying by accessible name for the delete button (aria-label)
//   - Composing status via TaskStatusButton (integration within TaskItem)
//   - Asserting callback calls with specific arguments

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils'
import { TaskItem } from '../TaskItem'
import type { Task, TaskStatus } from '../../types'

// Minimal task factory
function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Design homepage mockup',
    description: 'Create high-fidelity mockup.',
    status: 'Todo',
    projectId: 'proj-1',
    createdAt: '2025-01-10T09:30:00Z',
    ...overrides,
  }
}

// Default no-op callbacks
const noop = () => {}

describe('TaskItem', () => {
  describe('rendering', () => {
    it('renders the task title as a link', () => {
      const task = makeTask({ title: 'Design homepage mockup' })
      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={noop}
        />,
      )

      expect(
        screen.getByRole('link', { name: /design homepage mockup/i }),
      ).toBeInTheDocument()
    })

    it('renders the status badge with the task status text', () => {
      const task = makeTask({ status: 'InProgress' })
      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={noop}
        />,
      )

      expect(screen.getByText('InProgress')).toBeInTheDocument()
    })

    it('renders the assignee name when assigneeId is known', () => {
      // tm-3 is Emily Rodriguez in TEAM_MEMBERS
      const task = makeTask({ assigneeId: 'tm-3' })
      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={noop}
        />,
      )

      expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument()
    })

    it('does not render an assignee name when no assigneeId is set', () => {
      const task = makeTask({ assigneeId: undefined })
      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={noop}
        />,
      )

      // None of the team member names should appear
      expect(screen.queryByText('Sarah Chen')).not.toBeInTheDocument()
      expect(screen.queryByText('Marcus Johnson')).not.toBeInTheDocument()
    })

    it('renders the delete button with an accessible label', () => {
      const task = makeTask({ title: 'My Task' })
      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={noop}
        />,
      )

      expect(
        screen.getByRole('button', { name: /delete task: my task/i }),
      ).toBeInTheDocument()
    })
  })

  describe('status transitions', () => {
    it('shows an "In Progress" button for a Todo task', () => {
      const task = makeTask({ status: 'Todo' })
      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={noop}
        />,
      )

      expect(
        screen.getByRole('button', { name: /in progress/i }),
      ).toBeInTheDocument()
    })

    it('calls onStatusChange when status button is clicked', async () => {
      const user = userEvent.setup()
      const onStatusChange = vi.fn()
      const task = makeTask({ id: 'task-5', status: 'Todo' })

      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={onStatusChange}
          onAssign={noop}
          onDelete={noop}
        />,
      )

      await user.click(screen.getByRole('button', { name: /in progress/i }))

      expect(onStatusChange).toHaveBeenCalledTimes(1)
      expect(onStatusChange).toHaveBeenCalledWith('task-5', 'InProgress', undefined)
    })

    it('shows no status transition buttons for a Done task', () => {
      const task = makeTask({ status: 'Done' })
      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={noop}
        />,
      )

      // TaskStatusButton returns null for Done tasks
      expect(
        screen.queryByRole('button', { name: /in progress/i }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /in review/i }),
      ).not.toBeInTheDocument()
    })
  })

  describe('delete interaction', () => {
    it('calls onDelete with the task id when the delete button is clicked', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      const task = makeTask({ id: 'task-7', title: 'Delete Me' })

      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={onDelete}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: /delete task: delete me/i }),
      )

      expect(onDelete).toHaveBeenCalledTimes(1)
      expect(onDelete).toHaveBeenCalledWith('task-7')
    })

    it('disables the delete button when isDeleting is true', () => {
      const task = makeTask({ title: 'Busy Task' })
      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={noop}
          isDeleting={true}
        />,
      )

      expect(
        screen.getByRole('button', { name: /delete task: busy task/i }),
      ).toBeDisabled()
    })
  })

  describe('optimistic task', () => {
    it('disables the delete button for optimistic (temp-) tasks', () => {
      const task = makeTask({ id: 'temp-123', title: 'Optimistic Task' })
      renderWithProviders(
        <TaskItem
          task={task}
          projectId="proj-1"
          onStatusChange={noop}
          onAssign={noop}
          onDelete={noop}
        />,
      )

      expect(
        screen.getByRole('button', { name: /delete task: optimistic task/i }),
      ).toBeDisabled()
    })
  })

  describe('task status badge variants', () => {
    const statuses: TaskStatus[] = ['Todo', 'InProgress', 'InReview', 'Done']

    statuses.forEach((status) => {
      it(`renders "${status}" status badge correctly`, () => {
        const task = makeTask({ status })
        renderWithProviders(
          <TaskItem
            task={task}
            projectId="proj-1"
            onStatusChange={noop}
            onAssign={noop}
            onDelete={noop}
          />,
        )

        expect(screen.getByText(status)).toBeInTheDocument()
      })
    })
  })
})
