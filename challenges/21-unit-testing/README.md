# Challenge 21 — Unit Testing Components

## Overview

You have a fully-featured TaskFlow application with Redux Toolkit, TanStack Query,
MSW, routing, performance optimisations, and error boundaries. Now it is time to
write unit tests that verify the application actually works.

This challenge introduces **Vitest** and **React Testing Library** — the standard
testing stack for modern React applications. You will write tests that exercise
real user behaviour: rendering lists, clicking filter buttons, submitting forms,
and changing task statuses.

## Learning Goals

- Configure Vitest with jsdom for component testing
- Use `renderWithProviders` to mount components with all required context
- Query the DOM with `screen.getByRole`, `getByText`, `getByLabelText`
- Simulate user interactions with `@testing-library/user-event`
- Understand `getBy` vs `queryBy` vs `findBy`
- Write tests that describe behaviour, not implementation details

## What Testing Library Teaches You

React Testing Library operates on a single principle: **test the way your users
use the application**. That means:

- Query by visible text, role, or label — not by CSS class or data-testid
- Simulate real pointer / keyboard events — not synthetic DOM events
- Assert on what appears in the DOM — not on internal component state

## Tasks

### Step 1 — Explore the test infrastructure

Open `src/test/setup.ts`. It imports `@testing-library/jest-dom/vitest`, which
adds matchers like `toBeInTheDocument()`, `toBeDisabled()`, and `toHaveValue()`
to Vitest's `expect`.

Open `src/test/utils.tsx`. This file exports `renderWithProviders`, a helper
that wraps any component in the full provider tree:
`QueryClientProvider > Provider (Redux) > ThemeProvider > AuthProvider > MemoryRouter`.

This is necessary because most components in TaskFlow consume at least one of
these contexts. Without the wrapper they would throw on first render.

### Step 2 — Write `ProjectListItem` tests

Create `src/components/__tests__/ProjectListItem.test.tsx`.

A `ProjectListItem` displays a project name, status badge, and task count.
Write tests for:

1. The project name is rendered as a link
2. The correct status badge text appears
3. The task count is shown

Hint: `screen.getByRole('link', { name: /website redesign/i })` matches the
anchor element whose accessible name contains that text.

### Step 3 — Write `TaskStatusButton` tests

Create `src/components/__tests__/TaskStatusButton.test.tsx`.

A `TaskStatusButton` renders the valid next-status transitions for a task.
A `Todo` task shows an "In Progress" button; a `Done` task shows nothing.
Write tests for:

1. A Todo task renders a button to move it to In Progress
2. A Done task renders no status buttons
3. Clicking the button calls `onStatusChange` with the correct arguments

### Step 4 — Write `AddTaskForm` tests

Create `src/components/__tests__/AddTaskForm.test.tsx`.

`AddTaskForm` renders a toggle button when closed and a form when open.
Write tests for:

1. Initially only the "+ Add task" toggle button is visible
2. Clicking the toggle opens the form (title input appears)
3. Submitting with a title shorter than 2 characters shows a validation error
4. Submitting a valid title calls the mutation (check that the input clears or
   success state is reached)

Note: `AddTaskForm` calls `useCreateTask` which makes network requests. In
tests these will be intercepted by MSW if you start the MSW server in setup.
For simplicity in this challenge, you can mock the module or observe that the
optimistic UI updates immediately.

### Step 5 — Write `TaskItem` tests

Create `src/components/__tests__/TaskItem.test.tsx`.

A `TaskItem` displays the task title, status badge, optional assignee name,
delete button, and status transition buttons. Write tests for:

1. The task title is displayed
2. The status badge shows the correct status text
3. Clicking the delete button calls `onDelete` with the task id
4. A Todo task shows the "In Progress" status button

## Queries Cheat Sheet

| Query       | Returns             | Throws if not found | Use when                          |
|-------------|---------------------|---------------------|-----------------------------------|
| `getBy…`    | element             | yes                 | element must be in DOM right now  |
| `queryBy…`  | element or null     | no                  | asserting element is NOT present  |
| `findBy…`   | Promise\<element\>  | yes (after timeout) | element appears asynchronously    |
| `getAllBy…` | element[]           | yes if empty        | multiple matching elements        |

## User Event vs fireEvent

Prefer `userEvent` from `@testing-library/user-event`:

```typescript
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'hello');
await user.keyboard('{Enter}');
```

`userEvent` fires the full browser event sequence (pointerdown, mousedown,
focus, pointerup, mouseup, click) rather than a single synthetic event. This
means your tests catch bugs that only appear with real user input.

Use `fireEvent` only when you need direct control over a single low-level event
or when `userEvent` is unavailable.

## Running Tests

```bash
npm run test          # watch mode
npm run test -- --run # run once and exit (useful in CI)
```

## Relevant Docs

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [jest-dom matchers](https://github.com/testing-library/jest-dom)
- [user-event](https://testing-library.com/docs/user-event/intro)
