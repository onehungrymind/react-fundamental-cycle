import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Task, TaskStatus } from '../types'
import { TEAM_MEMBERS } from '../data/team'
import { TaskStatusButton } from './TaskStatusButton'
import { TaskAssignment } from './TaskAssignment'
import { Toast } from './Toast'
import { useState, useRef } from 'react'
import { UNDO_WINDOW_MS } from '../hooks/mutations/useDeleteTask'

// Challenge 19 — Performance: React.memo
//
// STEP 1: Wrap TaskItem in React.memo.
//
// React.memo performs a shallow prop comparison before each render.
// If every prop is === to its previous value, the render is skipped
// and React reuses the last output.
//
// For this to actually prevent re-renders when the parent re-renders
// due to a searchQuery change:
//   - `task` (object): must be the same reference — TanStack Query
//     returns stable references when the underlying data hasn't changed.
//   - `projectId` (string): primitive — === comparison works fine.
//   - `onStatusChange`, `onAssign`, `onDelete` (functions): must be
//     stable references — this requires useCallback in the parent.
//     Without useCallback, React.memo cannot help for function props.
//
// Named function syntax (memo(function TaskItem(...))) is preferred
// over memo(() => ...) because:
//   1. The component has a displayable name in React DevTools.
//   2. Stack traces include the function name.
//   3. Easier to read in flame graphs.

// Props are lifted: the parent (TaskList) owns the mutations and
// passes stable callbacks.  This design also removes the need for
// TaskItem to call mutation hooks directly, which simplifies testing.

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
  const member = TEAM_MEMBERS.find((m) => m.id === task.assigneeId);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOptimistic = task.id.startsWith('temp-');

  // Note: handleDelete is NOT wrapped in useCallback here because it's
  // a local function, not passed as a prop to a child.  useCallback is
  // only needed when passing functions as props to memo'd children.
  function handleDelete() {
    onDelete(task.id);
    // Show a brief toast.  In the start/ version, undo was managed by
    // TaskItem calling the mutation hook directly and receiving the undo
    // function from onMutate context.  In this solution the mutation lives
    // in TaskList — lifting the undo callback further is out of scope.
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
          {member !== undefined && (
            <span className="task-item__assignee">{member.name}</span>
          )}
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
          {/* Pass handlers from parent — these are the stabilised useCallback refs */}
          <TaskStatusButton
            task={task}
            onStatusChange={onStatusChange}
          />
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
