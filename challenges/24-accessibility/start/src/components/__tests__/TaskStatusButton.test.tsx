// Challenge 24 — Accessibility Fundamentals
//
// START VERSION tests — these verify the component renders and works,
// but cannot assert on aria-label containing task title (that is the bug
// students are asked to fix).

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

describe('TaskStatusButton — renders correct buttons', () => {
  it('Todo: renders one "In Progress" button', () => {
    const task = makeTask({ status: 'Todo' });
    render(<TaskStatusButton task={task} onStatusChange={vi.fn()} />);
    // Button text includes the status label
    expect(screen.getByRole('button', { name: /In Progress/i })).toBeInTheDocument();
  });

  it('InProgress: renders one "In Review" button', () => {
    const task = makeTask({ status: 'InProgress' });
    render(<TaskStatusButton task={task} onStatusChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /In Review/i })).toBeInTheDocument();
  });

  it('InReview: renders "Done" and "In Progress" buttons', () => {
    const task = makeTask({ status: 'InReview' });
    render(<TaskStatusButton task={task} onStatusChange={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('Done: renders nothing', () => {
    const task = makeTask({ status: 'Done' });
    const { container } = render(
      <TaskStatusButton task={task} onStatusChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('TaskStatusButton — interaction', () => {
  it('calls onStatusChange when clicked', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();
    const task = makeTask({ status: 'Todo' });
    render(<TaskStatusButton task={task} onStatusChange={onStatusChange} />);

    await user.click(screen.getByRole('button', { name: /In Progress/i }));
    expect(onStatusChange).toHaveBeenCalledWith('task-1', 'InProgress', undefined);
  });
});

describe('TaskStatusButton — accessibility BUG (start version)', () => {
  it('button does NOT have an aria-label that includes the task title (this is the bug)', () => {
    const task = makeTask({ status: 'Todo', title: 'Fix the login bug' });
    render(<TaskStatusButton task={task} onStatusChange={vi.fn()} />);

    // The button exists but its accessible name does not include the task title.
    // Students should fix this by adding aria-label="Change status of {title} to {status}".
    const btn = screen.getByRole('button', { name: /In Progress/i });
    const ariaLabel = btn.getAttribute('aria-label');
    // The bug: no aria-label at all, or aria-label does not include the task title
    expect(ariaLabel).not.toMatch(/Fix the login bug/i);
  });
});
