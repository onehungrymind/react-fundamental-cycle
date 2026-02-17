// Challenge 26 — Capstone update:
// Uses TeamMemberSelect (searchable combobox) instead of TaskAssignment
// (basic <select>) for Feature 1.

import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Task, TaskStatus } from '../types'
import { TaskStatusButton } from './TaskStatusButton'
import { TeamMemberSelect } from './TeamMemberSelect'
import { Toast } from './Toast'
import { useState, useRef } from 'react'
import { UNDO_WINDOW_MS } from '../hooks/mutations/useDeleteTask'

interface TaskItemProps {
  task: Task;
  projectId: string;
  onStatusChange: (taskId: string, newStatus: TaskStatus, completedAt?: string) => void;
  onAssign: (taskId: string, assigneeId: string | undefined) => void;
  onDelete: (taskId: string) => void;
  isDeleting?: boolean;
}

export const TaskItem = memo(function TaskItem({
  task,
  projectId,
  onStatusChange,
  onAssign,
  onDelete,
  isDeleting = false,
}: TaskItemProps) {
  const [showUndoToast, setShowUndoToast] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOptimistic = task.id.startsWith('temp-');

  function handleDelete() {
    onDelete(task.id);
    setShowUndoToast(true);
    timerRef.current = setTimeout(() => {
      setShowUndoToast(false);
    }, UNDO_WINDOW_MS);
  }

  function handleUndo() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowUndoToast(false);
  }

  return (
    <>
      <div className={`task-item${isOptimistic ? ' task-item--optimistic' : ''}`}>
        <div className="task-item__top">
          <Link
            to={`/projects/${projectId}/tasks/${task.id}`}
            className="task-item__title"
          >
            {task.title}
          </Link>
          <span className={`status-badge status-badge--${task.status}`}>
            {task.status}
          </span>
          <button
            type="button"
            className="task-delete-btn"
            onClick={handleDelete}
            disabled={isDeleting || isOptimistic}
            aria-label={`Delete task: ${task.title}`}
            title="Delete task"
          >
            &#10005;
          </button>
        </div>

        <div className="task-item__actions">
          <TaskStatusButton
            task={task}
            onStatusChange={onStatusChange}
          />
          {/* Feature 1: searchable combobox replaces basic select */}
          <TeamMemberSelect
            taskId={task.id}
            assigneeId={task.assigneeId}
            onAssign={onAssign}
          />
        </div>
      </div>

      {showUndoToast && (
        <Toast
          message="Task deleted."
          variant="success"
          action={{ label: 'Undo', onClick: handleUndo }}
        />
      )}
    </>
  )
})

export default TaskItem
