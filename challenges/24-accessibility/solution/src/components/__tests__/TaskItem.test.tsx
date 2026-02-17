// Challenge 24 — Accessibility Fundamentals
// TaskItem tests — verifying aria-label on delete button.

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TaskItem } from '../TaskItem'
import type { Task } from '../../types'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Set up CI pipeline',
    description: 'Configure GitHub Actions',
    status: 'Todo',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function renderTaskItem(task: Task, props: {
  onStatusChange?: (id: string, status: Task['status'], completedAt?: string) => void;
  onAssign?: (id: string, assigneeId: string | undefined) => void;
  onDelete?: (id: string) => void;
} = {}) {
  return render(
    <MemoryRouter>
      <TaskItem
        task={task}
        projectId="proj-1"
        onStatusChange={props.onStatusChange ?? vi.fn()}
        onAssign={props.onAssign ?? vi.fn()}
        onDelete={props.onDelete ?? vi.fn()}
      />
    </MemoryRouter>,
  );
}

describe('TaskItem', () => {
  it('renders the task title as a link', () => {
    renderTaskItem(makeTask());
    const link = screen.getByRole('link', { name: 'Set up CI pipeline' });
    expect(link).toBeInTheDocument();
  });

  it('delete button has aria-label that includes the task title', () => {
    renderTaskItem(makeTask());
    const deleteBtn = screen.getByRole('button', {
      name: 'Delete task: Set up CI pipeline',
    });
    expect(deleteBtn).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderTaskItem(makeTask(), { onDelete });
    await user.click(screen.getByRole('button', { name: /Delete task/i }));
    expect(onDelete).toHaveBeenCalledWith('task-1');
  });

  it('delete button is disabled for optimistic tasks', () => {
    const task = makeTask({ id: 'temp-abc' });
    renderTaskItem(task);
    const deleteBtn = screen.getByRole('button', { name: /Delete task/i });
    expect(deleteBtn).toBeDisabled();
  });
});
