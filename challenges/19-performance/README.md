# Challenge 19 — Performance: React.memo, useMemo, useCallback

## Learning Goals

By the end of this challenge you will be able to:

- Profile a React application with React DevTools Profiler
- Identify unnecessary re-renders by reading flame graphs
- Apply `React.memo` to prevent component re-renders when props are unchanged
- Apply `useCallback` to stabilise handler references passed to memoized components
- Apply `useMemo` to avoid re-computing expensive derived values on every render
- Understand when these optimisations help and when they are unnecessary overhead

---

## The Problem

Open the **start/** directory and run the app (`npm install && npm run dev`).

1. Navigate to any project with tasks.
2. Open **React DevTools** → **Profiler** tab → click the record button.
3. Type a few characters in the **Search tasks** input.
4. Stop recording and inspect the flame graph.

**Observation:** Every `TaskItem` component highlights on every keystroke — even for tasks whose data has not changed. The parent `TaskList` re-renders because its `searchQuery` state changes, which causes all children to re-render by default.

This is the classic "unnecessary re-render" problem: children re-render simply because the parent did, not because their own props changed.

---

## Your Tasks

### 1. Wrap `TaskItem` in `React.memo`

File: `src/components/TaskItem.tsx`

```tsx
import { memo } from 'react'

export const TaskItem = memo(function TaskItem({ task, onStatusChange, onAssign, onDelete }: TaskItemProps) {
  // existing body unchanged
})
```

`React.memo` performs a **shallow comparison** of props on every render of the parent. If all props are strictly equal (`===`) to the previous render, React skips re-rendering the child.

> Warning: if you pass a new function reference on every render (e.g. an inline arrow), `memo` cannot help — the function reference always changes. This leads to the next step.

### 2. Refactor `TaskList` to accept handler props (prop-lifting)

For `React.memo` to actually prevent re-renders, the handler functions (`onStatusChange`, `onAssign`, `onDelete`) passed to `TaskItem` must be stable references. To achieve this, the mutations should live in `TaskList` and the handlers should be stabilised with `useCallback`.

Update `TaskItem`'s props interface:

```ts
interface TaskItemProps {
  task: Task;
  projectId: string;
  onStatusChange: (taskId: string, newStatus: TaskStatus, completedAt?: string) => void;
  onAssign: (taskId: string, assigneeId: string | undefined) => void;
  onDelete: (taskId: string) => void;
}
```

### 3. Apply `useCallback` to handlers in `TaskList`

File: `src/components/TaskList.tsx`

```tsx
const handleStatusChange = useCallback(
  (taskId: string, newStatus: TaskStatus, completedAt?: string) => {
    updateTaskMutation.mutate({ taskId, data: { status: newStatus, completedAt } })
  },
  [updateTaskMutation],
)

const handleAssign = useCallback(
  (taskId: string, assigneeId: string | undefined) => {
    updateTaskMutation.mutate({ taskId, data: { assigneeId } })
  },
  [updateTaskMutation],
)

const handleDelete = useCallback(
  (taskId: string) => {
    deleteTaskMutation.mutate(taskId)
  },
  [deleteTaskMutation],
)
```

`useCallback` returns the **same function reference** as long as the dependencies do not change. Combined with `React.memo`, this prevents `TaskItem` from re-rendering when only `searchQuery` changes.

### 4. Apply `useMemo` to the filtered task list

File: `src/components/TaskList.tsx`

```tsx
const filteredTasks = useMemo(() => {
  if (!searchQuery.trim()) return tasks
  const q = searchQuery.toLowerCase()
  return tasks.filter((t) => t.title.toLowerCase().includes(q))
}, [tasks, searchQuery])
```

`useMemo` caches the filtered result. It only re-runs when `tasks` or `searchQuery` actually changes — not on every unrelated re-render of the parent tree.

### 5. Extract `TaskSearchInput` as a separate component

File: `src/components/TaskSearchInput.tsx`

Keeping the search input state **colocated** in a small, focused component limits the re-render scope. When `searchQuery` changes, only `TaskSearchInput` and whatever reads from it need to re-render — not the entire page tree.

```tsx
interface TaskSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaskSearchInput({ value, onChange }: TaskSearchInputProps) {
  return (
    <input
      type="search"
      className="task-search-input"
      placeholder="Search tasks..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search tasks"
    />
  )
}
```

---

## Re-profile After Your Changes

After completing all steps:

1. Record a new Profiler session while typing in the search input.
2. Confirm that `TaskItem` components **no longer highlight** (or show a much shorter bar) on keystrokes for tasks that did not match or unmatch.
3. Notice that the `TaskList` itself still re-renders (it owns the state), but its children are skipped.

---

## Key Concepts

| Hook / API       | Purpose                                                              |
|------------------|----------------------------------------------------------------------|
| `React.memo`     | Skip re-render if all props are shallowly equal                     |
| `useCallback`    | Return stable function reference when dependencies unchanged         |
| `useMemo`        | Return cached value when dependencies unchanged                      |

**Golden rule:** Apply these only after profiling confirms a real problem. Premature optimisation adds cognitive overhead without measurable benefit. The React Compiler (currently experimental) can apply many of these transformations automatically.

---

## Stretch Goals

- Apply `React.memo` to `TaskStatusButton` and `TaskAssignment` as well — do they help?
- Replace the list with a windowed/virtualised list (e.g. `react-window`) to handle 10 000 tasks
- Add a `useTransition` around the filter update to keep typing responsive while filtering is expensive
