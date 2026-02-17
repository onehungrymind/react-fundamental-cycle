// TODO Feature 1: Replace TaskAssignment (basic select) with TeamMemberSelect
// (searchable combobox) in the task actions area below.
//
// Steps:
//   1. Create src/components/TeamMemberSelect.tsx
//   2. Create src/hooks/queries/useTeam.ts
//   3. Import TeamMemberSelect here instead of TaskAssignment
//   4. Replace <TaskAssignment ... /> with <TeamMemberSelect ... />
//
// The interface for TeamMemberSelect:
//   taskId: string        — the task's id
//   assigneeId?: string   — current assignee id (or undefined)
//   onAssign: (taskId: string, assigneeId: string | undefined) => void

import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Task, TaskStatus } from '../types'
import { TaskStatusButton } from './TaskStatusButton'
import { TaskAssignment } from './TaskAssignment'
import { Toast } from './Toast'
import { useState, useRef } from 'react'
import { UNDO_WINDOW_MS } from '../hooks/mutations/useDeleteTask'

// TODO Feature 1: uncomment when TeamMemberSelect is ready
// import { TeamMemberSelect } from './TeamMemberSelect'

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
          {/* TODO Feature 1: replace TaskAssignment with TeamMemberSelect
              <TeamMemberSelect
                taskId={task.id}
                assigneeId={task.assigneeId}
                onAssign={onAssign}
              />
          */}
          <TaskAssignment
            task={task}
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
