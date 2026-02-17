# Challenge 16 — Mutations & Optimistic Updates

## What you'll build

Wire up full CRUD for tasks using **TanStack Query mutations** with optimistic updates. Every write immediately reflects in the UI before the server responds — and gracefully rolls back if the request fails.

## Learning objectives

- `useMutation` lifecycle: `onMutate` → `onError` → `onSettled`
- `queryClient.cancelQueries` before mutating to prevent race conditions
- Snapshot-and-restore rollback pattern with `context`
- `queryClient.setQueryData` for instant optimistic cache updates
- `queryClient.invalidateQueries` on settled to sync with server
- Pessimistic vs optimistic update trade-offs
- Undo-delete pattern with a 3-second grace window

## Starting point

The `start/` directory has all reads wired to TanStack Query (from Challenge 15). The MSW handlers for `POST /api/projects/:id/tasks`, `PATCH /api/tasks/:id`, and `DELETE /api/tasks/:id` already exist — but the UI components still use `useReducer` for local state. Your job is to replace those local mutations with proper TanStack Query mutations.

## Tasks

### 1. Create `src/api/tasks.ts`

Add typed fetch functions for each mutation:

```ts
createTask(projectId: string, data: Partial<Task>): Promise<Task>
updateTask(taskId: string, data: Partial<Task>): Promise<Task>
deleteTask(taskId: string): Promise<void>
```

### 2. Create `src/hooks/mutations/useCreateTask.ts`

```ts
export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Task>) => createTask(projectId, data),
    onMutate: async (newTaskData) => {
      // 1. Cancel any in-flight queries for this project
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] });
      // 2. Snapshot the current cache
      const previous = queryClient.getQueryData(['projects', projectId]);
      // 3. Optimistically add the new task
      queryClient.setQueryData(['projects', projectId], (old) => ...);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Roll back to snapshot
      if (context?.previous) queryClient.setQueryData(...);
    },
    onSettled: () => {
      // Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
  });
}
```

### 3. Create `src/hooks/mutations/useUpdateTask.ts`

Same onMutate/onError/onSettled pattern for status changes and assignee updates.

### 4. Create `src/hooks/mutations/useDeleteTask.ts`

Optimistically remove the task from the cache. Show a 3-second toast with an **Undo** button. If the user clicks Undo within the window, call `queryClient.cancelMutate` (or simply re-add with a follow-up optimistic update). If Undo is not clicked, let the mutation proceed.

### 5. Update `src/components/TaskList.tsx`

Remove `useReducer`. Read tasks directly from the `useProject` cache (via outlet context). Pass mutation hooks down as callbacks.

### 6. Update `src/components/TaskItem.tsx`

Replace `dispatch` prop with mutation callback props.

### 7. Update `src/components/TaskStatusButton.tsx`

Call `useUpdateTask` mutation instead of dispatching a reducer action.

### 8. Update `src/components/TaskAssignment.tsx`

Call `useUpdateTask` mutation instead of dispatching a reducer action.

### 9. Update `src/components/AddTaskForm.tsx`

Call `useCreateTask` mutation instead of dispatching `ADD_TASK`.

### 10. Update `src/components/Toast.tsx`

Support `variant: 'success' | 'error'` and an optional action button (for Undo).

## Key concepts

### The optimistic update pattern

```
User clicks "Mark In Progress"
  │
  ├─ onMutate:  cancel queries → snapshot → update cache instantly
  │               UI shows "In Progress" badge immediately
  │
  ├─ [network request fires in background]
  │
  ├─ onError:   restore snapshot → show error toast
  │               UI reverts to "Todo"
  │
  └─ onSettled: invalidate query → background refetch confirms server state
```

### Why cancelQueries?

If a background refetch is already in-flight when you call `setQueryData`, the refetch could complete and overwrite your optimistic update with stale data. `cancelQueries` prevents this race condition.

### Why invalidate on settled (not just success)?

`onSettled` runs after both success and error. Invalidating here ensures the cache is always synced with the server after the mutation completes — even if the mutation succeeded but returned slightly different data than what you predicted optimistically.

## Acceptance criteria

- [ ] Creating a task instantly shows it in the list (optimistic), then syncs with the server
- [ ] Updating a task status instantly shows the new badge, rolls back on error
- [ ] Assigning a task instantly shows the assignee name, rolls back on error
- [ ] Deleting a task shows a 3-second undo toast; clicking Undo restores the task
- [ ] On any mutation error, the UI rolls back and shows an error toast
- [ ] `useReducer` / `taskReducer.ts` is fully removed from the task flow
- [ ] TypeScript strict — no `any`
