# Solution Debrief — Challenge 19: Performance

## What changed and why

### 1. `TaskItem` — wrapped in `React.memo`

```tsx
export const TaskItem = memo(function TaskItem({ ... }: TaskItemProps) {
  // ...
})
```

`React.memo` wraps the component in a higher-order component that performs a **shallow prop comparison** before each render. If every prop is `===` to its previous value, the render is skipped entirely and React reuses the last rendered output.

Shallow comparison means:
- Primitives (string, number, boolean) are compared by value — works perfectly.
- Objects and arrays are compared by reference — a new object literal `{}` always fails the check.
- Functions are compared by reference — a new arrow function `() => {}` always fails the check.

This is why `useCallback` is required for handler props.

### 2. Handler props moved to `TaskList` and stabilised with `useCallback`

The original `TaskItem` called mutation hooks internally, which was simple but made it impossible to memo-ise effectively (the mutation objects changed on each parent render). By lifting the mutations to `TaskList` and passing stable callbacks as props, we give `React.memo` stable references to compare.

```tsx
// useCallback returns the same function reference until [updateTaskMutation] changes.
// TanStack Query mutation objects are stable between renders when no mutation is in flight,
// so in practice these callbacks are very stable.
const handleStatusChange = useCallback(
  (taskId: string, newStatus: TaskStatus, completedAt?: string) => {
    updateTaskMutation.mutate({ taskId, data: { status: newStatus, completedAt } })
  },
  [updateTaskMutation],
)
```

**Dependency pitfall:** If you accidentally include a value that changes on every render (like an inline object) in the dependency array, `useCallback` provides no benefit. Always make dependency arrays as small and stable as possible.

### 3. `useMemo` for the filtered task list

```tsx
const filteredTasks = useMemo(() => {
  if (!searchQuery.trim()) return tasks
  const q = searchQuery.toLowerCase()
  return tasks.filter((t) => t.title.toLowerCase().includes(q))
}, [tasks, searchQuery])
```

Without `useMemo`, every re-render of `TaskList` (including those caused by Redux state changes or context updates unrelated to filtering) would re-run the filter. For 18 tasks this is trivial, but for thousands it becomes measurable. `useMemo` caches the result and only recomputes when `tasks` or `searchQuery` changes.

**Cost of useMemo:** `useMemo` itself has a small overhead (storing the cached value and comparing dependencies). For cheap computations on small arrays, `useMemo` can be slower than just recomputing. Measure first; apply judiciously.

### 4. `TaskSearchInput` — state colocation

Keeping search state in a small focused component (`TaskSearchInput` could own its own state and lift it via `onChange`) limits the re-render scope. When state lives high in the tree, more components re-render on each keystroke. Moving it down is the cheapest optimisation — no memoisation needed.

---

## The profiling workflow (repeat for any optimisation)

1. **Profile** — record a Profiler session that captures the slow interaction
2. **Identify** — find which components render unnecessarily (highlighted bars, large `actualDuration`)
3. **Hypothesise** — why are they re-rendering? prop change? parent re-render? context?
4. **Fix** — apply the minimal change (memo, useCallback, useMemo, state colocation)
5. **Re-profile** — confirm the improvement; check for regressions elsewhere

---

## When NOT to use these hooks

| Situation | Verdict |
|-----------|---------|
| Component renders rarely or cheaply | Skip memo — overhead not worth it |
| Handler never passed as prop to a memo'd child | Skip useCallback |
| Derived value is a cheap primitive operation | Skip useMemo |
| Working on an experiment / prototype | Skip all — premature optimisation |

---

## The React Compiler (future)

The React Compiler (previously React Forget) automatically memoises components and values at the compiler level, eliminating the need to manually write `React.memo`, `useCallback`, and `useMemo` in most cases. As of 2025 it is available as an opt-in Babel/SWC plugin. Once it is stable, most of this chapter becomes "understand how it works" rather than "write it by hand."

---

## Virtualization for long lists

When a list has hundreds or thousands of items, even perfectly memoised components have overhead (React still walks the virtual DOM tree). The solution is **windowed rendering** — only render the items currently visible in the viewport.

Popular libraries:
- `react-window` — lightweight, well-maintained
- `react-virtual` (TanStack Virtual) — more flexible, hook-based
- `react-virtuoso` — feature-rich (variable heights, sticky headers)

With 18 tasks in this app, virtualisation provides no benefit. At 500+ items it becomes the most impactful optimisation available.
