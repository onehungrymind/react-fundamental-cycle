# Challenge 13 — useReducer & Complex State Logic

## Goal

Replace ad-hoc `useState` task management with `useReducer` to centralise all task
state transitions in a single, testable, pure function.

## Background

When component state involves multiple related pieces that change together — or when
the next state depends on the previous state in non-trivial ways — `useReducer` is
often cleaner than several `useState` calls.

The pattern mirrors the Flux / Redux architecture:

```
dispatch(action) → reducer(state, action) → new state → re-render
```

The key properties of a well-written reducer:

- **Pure** — same inputs always produce the same output, no side effects
- **Immutable** — always return new arrays/objects, never mutate `state`
- **Exhaustive** — every action type is handled
- **Constrained** — invalid transitions are silently ignored (or can throw in dev)

## What you need to do

### 1. Create `src/reducers/taskReducer.ts`

Define the discriminated union type `TaskAction` and implement `taskReducer`.

The union must include these five action shapes:

| Action type          | Payload fields                              |
| -------------------- | ------------------------------------------- |
| `ADD_TASK`           | `task: Task`                                |
| `UPDATE_STATUS`      | `taskId: string`, `newStatus: TaskStatus`   |
| `ASSIGN_TASK`        | `taskId: string`, `assigneeId: string`      |
| `UNASSIGN_TASK`      | `taskId: string`                            |
| `BULK_UPDATE_STATUS` | `taskIds: string[]`, `newStatus: TaskStatus`|

Valid status transitions (anything else is silently ignored):

```
Todo       → InProgress
InProgress → InReview
InReview   → Done  |  InProgress   (reject back to InProgress)
Done       → (nothing)
```

When a task transitions to `Done`, also set `completedAt` to the current
ISO timestamp — **but** generate that timestamp outside the reducer and pass
it in via the payload, keeping the reducer pure.

### 2. Wire `useReducer` into `TaskList`

Replace the static import of `TASKS` with:

```typescript
const [tasks, dispatch] = useReducer(taskReducer, INITIAL_TASKS);
```

where `INITIAL_TASKS` is the filtered slice of tasks for this project (imported
from `src/data/tasks.ts`).

Pass `dispatch` down to child components that need it.

### 3. Update `TaskItem`

- Receive `dispatch` as a prop
- Render a `TaskStatusButton` component that shows available next statuses

### 4. Create `src/components/TaskStatusButton.tsx`

- Accepts `task` and `dispatch`
- Reads `VALID_TRANSITIONS` (export it from the reducer file) to know which
  buttons to show
- Each button dispatches `UPDATE_STATUS` with a timestamp generated in the
  handler (not inside the reducer)

### 5. Create `src/components/AddTaskForm.tsx`

A minimal form with a title input and a description textarea.

On submit it dispatches `ADD_TASK` with a fully-constructed `Task` object.
Generate the `id` (e.g. `crypto.randomUUID()`) and `createdAt` timestamp in
the submit handler — **not** inside the reducer.

### 6. Create `src/components/TaskAssignment.tsx`

A `<select>` populated from `TEAM_MEMBERS` (see `src/data/team.ts`).

- When a team member is chosen, dispatch `ASSIGN_TASK`
- When the empty option ("Unassigned") is chosen, dispatch `UNASSIGN_TASK`

### 7. Create `src/data/team.ts`

```typescript
export const TEAM_MEMBERS = [
  { id: 'tm-1', name: 'Sarah Chen' },
  { id: 'tm-2', name: 'Marcus Johnson' },
  { id: 'tm-3', name: 'Emily Rodriguez' },
  { id: 'tm-4', name: 'David Kim' },
  { id: 'tm-5', name: 'Lisa Patel' },
];
```

## Rules

- TypeScript strict mode — no `any`
- Named exports everywhere
- The reducer must be **pure**: do not call `Date.now()`, `Math.random()`, or
  `crypto.randomUUID()` inside it
- Always return a new array / object — never mutate state in place

## Stretch goals

1. Add a "Select all" checkbox and a bulk status update button that dispatches
   `BULK_UPDATE_STATUS`
2. Persist reducer state to `localStorage` with a custom `useLocalStorage` hook
3. Write unit tests for `taskReducer` using Vitest — test every valid transition
   and a few invalid ones
4. Replace the hand-rolled state machine with [XState](https://xstate.js.org/)
