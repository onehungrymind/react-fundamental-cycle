// Challenge 24 — Accessibility Fundamentals
// Tests for the SOLUTION TaskStatusButton: aria-label includes task title.

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskStatusButton } from '../TaskStatusButton'
import type { Task } from '../../types'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Fix the login bug',
    description: '',
    status: 'Todo',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('TaskStatusButton — accessible labels', () => {
  it('Todo task has aria-label containing task title and next status', () => {
    const task = makeTask({ status: 'Todo' });
    render(<TaskStatusButton task={task} onStatusChange={vi.fn()} />);

    const btn = screen.getByRole('button', {
      name: /Change status of Fix the login bug to In Progress/i,
    });
    expect(btn).toBeInTheDocument();
  });

  it('InProgress task has aria-label for In Review', () => {
    const task = makeTask({ status: 'InProgress' });
    render(<TaskStatusButton task={task} onStatusChange={vi.fn()} />);

    const btn = screen.getByRole('button', {
      name: /Change status of Fix the login bug to In Review/i,
    });
    expect(btn).toBeInTheDocument();
  });

  it('InReview task has two buttons with correct aria-labels', () => {
    const task = makeTask({ status: 'InReview' });
    render(<TaskStatusButton task={task} onStatusChange={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: /Change status of Fix the login bug to Done/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Change status of Fix the login bug to In Progress/i }),
    ).toBeInTheDocument();
  });

  it('Done task renders nothing', () => {
    const task = makeTask({ status: 'Done' });
    const { container } = render(
      <TaskStatusButton task={task} onStatusChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('TaskStatusButton — interaction', () => {
  it('calls onStatusChange with correct status when clicked', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();
    const task = makeTask({ status: 'Todo' });
    render(<TaskStatusButton task={task} onStatusChange={onStatusChange} />);

    await user.click(
      screen.getByRole('button', { name: /In Progress/i }),
    );

    expect(onStatusChange).toHaveBeenCalledWith('task-1', 'InProgress', undefined);
  });

  it('passes completedAt when status changes to Done', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();
    const task = makeTask({ status: 'InReview' });
    render(<TaskStatusButton task={task} onStatusChange={onStatusChange} />);

    await user.click(
      screen.getByRole('button', { name: /Change status of Fix the login bug to Done/i }),
    );

    expect(onStatusChange).toHaveBeenCalledWith(
      'task-1',
      'Done',
      expect.any(String),
    );
  });
});
