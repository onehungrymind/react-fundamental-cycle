# Solution Debrief — Challenge 16: Mutations & Optimistic Updates

## What changed from the start

| File | Change |
|------|--------|
| `src/api/tasks.ts` | NEW — mutation fetch functions |
| `src/hooks/mutations/useCreateTask.ts` | NEW — optimistic create |
| `src/hooks/mutations/useUpdateTask.ts` | NEW — optimistic update |
| `src/hooks/mutations/useDeleteTask.ts` | NEW — optimistic delete with undo |
| `src/components/TaskList.tsx` | Removed `useReducer`, uses mutation hooks |
| `src/components/TaskItem.tsx` | Replaced `dispatch` with mutation callbacks |
| `src/components/TaskStatusButton.tsx` | Calls `useUpdateTask` mutation |
| `src/components/TaskAssignment.tsx` | Calls `useUpdateTask` mutation |
| `src/components/AddTaskForm.tsx` | Calls `useCreateTask` mutation |
| `src/components/Toast.tsx` | Added `variant` + optional action button |
| `src/reducers/taskReducer.ts` | REMOVED |

---

## The `useMutation` lifecycle

```
mutate(variables)
  │
  ├── onMutate(variables)        ← runs synchronously before the fetch
  │     └─ returns context        ← context passed to onError/onSettled
  │
  ├── [network request]
  │
  ├── onSuccess(data, variables, context)    ← only on 2xx
  ├── onError(error, variables, context)     ← only on throw/non-2xx
  │
  └── onSettled(data|undefined, error|null, variables, context)
        └─ always runs — ideal for invalidation
```

## Why snapshot → restore works

`queryClient.getQueryData` returns the current cache value by reference. Saving it as `previous` in `onMutate` gives you a complete snapshot. If the mutation fails, `queryClient.setQueryData(key, context.previous)` replaces the optimistic data with the original, making the rollback invisible to the user.

## cancelQueries is critical

```ts
await queryClient.cancelQueries({ queryKey: ['projects', projectId] });
```

Without this, a background refetch triggered 29 seconds into the 30s staleTime window could complete *after* your `setQueryData` call and silently overwrite the optimistic update with server data — defeating the whole point.

## Pessimistic vs optimistic

| | Pessimistic | Optimistic |
|-|-------------|------------|
| UI updates when | Server responds | Immediately |
| Rollback needed | No | Yes |
| Feels | Sluggish on slow networks | Instant |
| Good for | Destructive actions, payments | Low-risk CRUD |

## The undo-delete pattern

```
User clicks Delete
  │
  ├─ onMutate: optimistically remove from cache
  │             show "Task deleted. Undo" toast for 3 seconds
  │             store undo timer ID in a ref
  │
  ├─ User clicks Undo within 3s:
  │     cancel the timer
  │     restore previous cache snapshot
  │     dismiss toast
  │
  └─ Timer expires (no undo):
        onSettled fires: invalidate → refetch confirms deletion
```

Note: The "undo" here is UI-only because `onMutate` fires before the server receives the request. The actual DELETE fires regardless of whether Undo is clicked (unless you use a more complex abort pattern). A production implementation would use `AbortController` or a server-side "soft delete + restore" endpoint.

## invalidateQueries on settled

```ts
onSettled: () => {
  void queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
}
```

This runs after both success and error. It marks the `['projects', projectId]` cache entry as stale and triggers a background refetch, ensuring the UI eventually shows the authoritative server state — even if the optimistic prediction was slightly wrong (e.g., the server sets a `createdAt` timestamp we didn't predict exactly).

## TypeScript strict notes

- `queryClient.getQueryData` returns `unknown` — cast with `as ProjectWithTasks | undefined`
- `context` in `onError` and `onSettled` is typed as the return type of `onMutate`
- For `deleteTask`, the `mutationFn` returns `Promise<void>`, so `onSuccess` receives `void`
- `setQueryData` updater function receives the typed previous value if you use a generic: `queryClient.setQueryData<ProjectWithTasks>(['projects', projectId], (old) => ...)`
