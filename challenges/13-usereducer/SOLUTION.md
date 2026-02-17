# Challenge 13 — Solution Notes

## What changed from Challenge 12

| File | Change |
|---|---|
| `src/reducers/taskReducer.ts` | New — pure reducer + `TaskAction` discriminated union |
| `src/data/team.ts` | New — `TEAM_MEMBERS` constant array |
| `src/components/TaskList.tsx` | Updated — uses `useReducer`, renders `AddTaskForm` |
| `src/components/TaskItem.tsx` | Updated — receives `dispatch`, renders `TaskStatusButton` + `TaskAssignment` |
| `src/components/TaskStatusButton.tsx` | New — next-state buttons driven by `VALID_TRANSITIONS` |
| `src/components/AddTaskForm.tsx` | New — form that dispatches `ADD_TASK` |
| `src/components/TaskAssignment.tsx` | New — dropdown that dispatches `ASSIGN_TASK` / `UNASSIGN_TASK` |

Everything else (routing, contexts, layout, project data) is unchanged.

---

## Key concepts

### Discriminated unions

A discriminated union is a TypeScript union where one field (the *discriminant*) is a
literal type, enabling the compiler to narrow the type inside each `case`:

```typescript
type TaskAction =
  | { type: 'ADD_TASK';      payload: { task: Task } }
  | { type: 'UPDATE_STATUS'; payload: { taskId: string; newStatus: TaskStatus } };

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD_TASK':
      // TypeScript knows action.payload.task exists here
      return [...state, action.payload.task];
    case 'UPDATE_STATUS':
      // TypeScript knows action.payload.taskId and newStatus exist here
      ...
  }
}
```

The `switch` statement exhausts the union. If you add a new action type and forget to
handle it, TypeScript will catch the error (especially with `noFallthroughCasesInSwitch`
and the `never` pattern).

### Pure reducers

The reducer must be a pure function:

```
taskReducer(state, action) === taskReducer(state, action)   // always true
```

This means:
- No `Date.now()` — timestamps are generated before `dispatch()` and passed in the payload
- No `Math.random()` or `crypto.randomUUID()` — IDs generated outside, passed in payload
- No API calls, no `console.log`, no state mutations

Benefits of purity:
- **Testability** — you can call `taskReducer` directly in unit tests, no mocking needed
- **Time-travel debugging** — React DevTools (and Redux DevTools) can replay actions
- **Predictability** — same inputs, same outputs, every time

### Dispatch stability

`useReducer` guarantees that `dispatch` is a stable reference — it never changes between
renders. This means you can safely pass it as a prop or include it in a `useCallback`
dependency array without causing extra re-renders.

Contrast with `useState`'s setter, which is also stable, but `dispatch` scales better
when the number of operations grows.

### State machines

The `VALID_TRANSITIONS` map is a minimal state machine:

```typescript
const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo:       ['InProgress'],
  InProgress: ['InReview'],
  InReview:   ['Done', 'InProgress'],
  Done:       [],
};
```

Benefits over free-form status strings:
- Impossible states become impossible to represent
- UI can derive which buttons to show directly from the machine
- Adding a new status forces you to declare its transitions explicitly

For production apps with more complex workflows, consider
[XState](https://xstate.js.org/) — it handles guards, side effects, parallel states,
history states, and more.

### Immer

For deeply nested state, `useImmer` from [immer](https://immerjs.github.io/immer/)
lets you write "mutating" code that is actually immutable under the hood:

```typescript
import { useImmerReducer } from 'use-immer';

function taskReducer(draft: Task[], action: TaskAction) {
  switch (action.type) {
    case 'UPDATE_STATUS': {
      const task = draft.find(t => t.id === action.payload.taskId);
      if (task) task.status = action.payload.newStatus; // safe mutation of draft
      break;
    }
  }
}
```

For flat arrays like `Task[]`, plain spread operators are fine and add no dependencies.

### useReducer vs useState

| Situation | Prefer |
|---|---|
| 1-2 independent boolean/string values | `useState` |
| Multiple values that change together | `useReducer` |
| Next state depends on previous state in complex ways | `useReducer` |
| State transitions follow a finite state machine | `useReducer` |
| You want to unit-test state logic independently | `useReducer` |
| Shared state across many components | Context + `useReducer` (or Zustand/Redux) |

---

## Implementation walkthrough

### taskReducer.ts

The file exports:
1. `VALID_TRANSITIONS` — the state machine map (used by UI to derive available buttons)
2. `TaskAction` — the discriminated union type
3. `taskReducer` — the pure reducer function

The `UPDATE_STATUS` case checks `VALID_TRANSITIONS[task.status]` before allowing the
transition, and sets `completedAt` when the task moves to `Done`.

### TaskList.tsx

```typescript
const projectTasks = TASKS.filter(t => t.projectId === projectId);
const [tasks, dispatch] = useReducer(taskReducer, projectTasks);
```

The initial state is the static slice filtered to the current project. After mount,
all mutations go through `dispatch` — the component owns the live copy.

`AddTaskForm` is rendered below the task list and receives `dispatch` and `projectId`.

### TaskStatusButton.tsx

```typescript
const nextStatuses = VALID_TRANSITIONS[task.status];
```

If `nextStatuses` is empty (i.e. the task is `Done`), the component renders nothing.
Otherwise it renders one button per valid next status.

The `completedAt` timestamp is generated in the click handler:

```typescript
dispatch({
  type: 'UPDATE_STATUS',
  payload: {
    taskId: task.id,
    newStatus,
    completedAt: newStatus === 'Done' ? new Date().toISOString() : undefined,
  },
});
```

### AddTaskForm.tsx

On submit, `crypto.randomUUID()` generates the ID and `new Date().toISOString()`
generates `createdAt` — both happen in the event handler before `dispatch` is called.

### TaskAssignment.tsx

The `<select>` value is the current `assigneeId` (or empty string for unassigned).
On change, it dispatches either `ASSIGN_TASK` or `UNASSIGN_TASK` depending on whether
the new value is empty.
