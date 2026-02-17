import { useState, useMemo, useCallback } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { TaskSearchInput } from './TaskSearchInput'
import { AddTaskForm } from './AddTaskForm'
import { useUpdateTask } from '../hooks/mutations/useUpdateTask'
import { useDeleteTask } from '../hooks/mutations/useDeleteTask'
import type { Task, TaskStatus } from '../types'
import type { ProjectDetailOutletContext } from '../pages/ProjectDetailPanel'

// Challenge 20 — Error Boundaries
//
// TODO: Wrap the <AddTaskForm> section below in an ErrorBoundary.
//
// If AddTaskForm throws during render (e.g. a validation bug), the rest
// of the task list (search, task items) should still be usable.
//
// Placement hint — around the AddTaskForm at the bottom of the return:
//   <ErrorBoundary fallback={...}>
//     <AddTaskForm projectId={projectId ?? ''} />
//   </ErrorBoundary>
//
// Also consider: should individual TaskItem rows each be wrapped in their
// own boundary so a single broken task card doesn't remove the whole list?

interface TaskListProps {
  initialTasks?: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const ctx = useOutletContext<ProjectDetailOutletContext | undefined>();
  const tasks = initialTasks ?? ctx?.tasks ?? [];

  const [searchQuery, setSearchQuery] = useState('');

  const updateTaskMutation = useUpdateTask(projectId ?? '');
  const deleteTaskMutation = useDeleteTask(projectId ?? '');

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

  const handleStatusChange = useCallback(
    (taskId: string, newStatus: TaskStatus, completedAt?: string) => {
      updateTaskMutation.mutate({ taskId, data: { status: newStatus, completedAt } });
    },
    [updateTaskMutation],
  );

  const handleAssign = useCallback(
    (taskId: string, assigneeId: string | undefined) => {
      updateTaskMutation.mutate({ taskId, data: { assigneeId } });
    },
    [updateTaskMutation],
  );

  const handleDelete = useCallback(
    (taskId: string) => {
      deleteTaskMutation.mutate(taskId);
    },
    [deleteTaskMutation],
  );

  return (
    <div className="task-list">
      <h3 className="task-list__heading">Tasks</h3>

      <div className="task-list__search">
        <TaskSearchInput value={searchQuery} onChange={setSearchQuery} />
        {searchQuery.trim() !== '' && (
          <span className="task-list__search-count">
            {filteredTasks.length} of {tasks.length} tasks
          </span>
        )}
      </div>

      {filteredTasks.length === 0 && tasks.length > 0 ? (
        <p className="task-list__empty">
          No tasks match &ldquo;{searchQuery}&rdquo;.
        </p>
      ) : filteredTasks.length === 0 ? (
        <p className="task-list__empty">No tasks for this project yet.</p>
      ) : (
        <ul className="task-list__items">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <TaskItem
                task={task}
                projectId={projectId ?? ''}
                onStatusChange={handleStatusChange}
                onAssign={handleAssign}
                onDelete={handleDelete}
                isDeleting={deleteTaskMutation.isPending}
              />
            </li>
          ))}
        </ul>
      )}

      {/* TODO: Wrap AddTaskForm in an ErrorBoundary */}
      <AddTaskForm projectId={projectId ?? ''} />
    </div>
  )
}

export default TaskList
