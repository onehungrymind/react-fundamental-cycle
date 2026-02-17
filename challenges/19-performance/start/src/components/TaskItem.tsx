import { Link } from 'react-router-dom'
import type { Task } from '../types'
import { TEAM_MEMBERS } from '../data/team'
import { TaskStatusButton } from './TaskStatusButton'
import { TaskAssignment } from './TaskAssignment'
import { useDeleteTask, UNDO_WINDOW_MS } from '../hooks/mutations/useDeleteTask'
import { Toast } from './Toast'
import { useState, useRef } from 'react'

// Challenge 19 — Performance
//
// PROBLEM: This component is NOT wrapped in React.memo.
//
// Because TaskList holds `searchQuery` state, every keystroke causes
// TaskList to re-render.  React then re-renders ALL TaskItem children
// by default — even those whose `task` prop hasn't changed.
//
// Steps to observe the problem:
//   1. Open React DevTools → Profiler tab
//   2. Click the record button
//   3. Type a few characters in the Search tasks input
//   4. Stop recording
//   5. In the flame graph you will see every TaskItem highlighted on
//      each keystroke, showing `actualDuration` > 0 ms per item
//
// Your job: apply React.memo to this component to fix the re-renders.
// See README.md for the full step-by-step instructions.

interface TaskItemProps {
  task: Task;
  projectId: string;
}

// No React.memo here — intentionally unoptimised for the start/ version.
// Every parent re-render will re-render this component even when `task`
// and `projectId` are unchanged.
export function TaskItem({ task, projectId }: TaskItemProps) {
  const member = TEAM_MEMBERS.find((m) => m.id === task.assigneeId);
  const deleteMutation = useDeleteTask(projectId);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const undoFnRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOptimistic = task.id.startsWith('temp-');

  function handleDelete() {
    deleteMutation.mutate(task.id, {
      onSuccess: (_data, _vars, context) => {
        if (context !== undefined) {
          undoFnRef.current = context.undo;
        }
        setShowUndoToast(true);
        timerRef.current = setTimeout(() => {
          setShowUndoToast(false);
          undoFnRef.current = null;
        }, UNDO_WINDOW_MS);
      },
    });
  }

  function handleUndo() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowUndoToast(false);
    if (undoFnRef.current !== null) {
      undoFnRef.current();
      undoFnRef.current = null;
    }
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
            disabled={deleteMutation.isPending || isOptimistic}
            aria-label={`Delete task: ${task.title}`}
            title="Delete task"
          >
            &#10005;
          </button>
        </div>

        <div className="task-item__actions">
          <TaskStatusButton task={task} projectId={projectId} />
          <TaskAssignment task={task} projectId={projectId} />
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
}

export default TaskItem
