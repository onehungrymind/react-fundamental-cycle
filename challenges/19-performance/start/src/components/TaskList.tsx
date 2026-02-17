import { useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { TaskItem } from './TaskItem'
import { AddTaskForm } from './AddTaskForm'
import type { Task } from '../types'
import type { ProjectDetailOutletContext } from '../pages/ProjectDetailPanel'

// Challenge 19 — Performance
//
// PROBLEM: This component has three performance issues.
//
// 1. No useMemo on the filtered task list
//    The filter runs on every render, even when neither `tasks` nor
//    `searchQuery` has changed.  This is harmless for 12 tasks but
//    measurable for thousands.
//
// 2. No useCallback on handler functions
//    Each render creates fresh arrow functions.  When TaskItem is
//    eventually memoised with React.memo, these fresh references will
//    invalidate the memo check on every keystroke.
//
// 3. Search state is in the parent
//    Typing in the search input calls setSearchQuery, which re-renders
//    TaskList and — because TaskItem has no memo — re-renders every
//    TaskItem child too.
//
// Your job:
//   - Add useMemo for filteredTasks (dependency: [tasks, searchQuery])
//   - Add useCallback for any handlers passed as props to TaskItem
//   - See README.md for full instructions

interface TaskListProps {
  initialTasks?: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const ctx = useOutletContext<ProjectDetailOutletContext | undefined>();
  const tasks = initialTasks ?? ctx?.tasks ?? [];

  // Search state lives here.
  // Every keystroke calls setSearchQuery, which re-renders TaskList,
  // which re-renders all TaskItem children.
  const [searchQuery, setSearchQuery] = useState('');

  // No useMemo — the filter runs on every render
  const filteredTasks = searchQuery.trim()
    ? tasks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  return (
    <div className="task-list">
      <h3 className="task-list__heading">Tasks</h3>

      {/* Search input — typing here triggers re-renders of ALL TaskItem children */}
      <div className="task-list__search">
        <input
          type="search"
          className="task-search-input"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tasks"
        />
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
              {/* No useCallback here — a new function reference is created on every render.
                  When React.memo is applied to TaskItem, these fresh references will cause
                  unnecessary re-renders unless useCallback is also used. */}
              <TaskItem
                task={task}
                projectId={projectId ?? ''}
              />
            </li>
          ))}
        </ul>
      )}

      <AddTaskForm projectId={projectId ?? ''} />
    </div>
  )
}

export default TaskList
