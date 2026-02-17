# React Fundamentals Cycle

A progressive, 26-challenge workshop that builds **TaskFlow** — a project management application — from an empty Vite template to a fully tested, accessible, production-ready React app.

## What You'll Build

TaskFlow is a project management tool with projects, tasks, team members, filtering, routing, real-time updates, and a dashboard. Each challenge adds one concept to the application, so by the end you've built a non-trivial app while learning React fundamentals in context.

**Stack:** React 19, TypeScript, Vite, React Router v7, TanStack Query v5, Zustand, Redux Toolkit, Vitest, React Testing Library, MSW

## How It Works

The workshop is divided into **26 challenges** across 4 phases. Each challenge has:

```
challenges/NN-challenge-name/
  README.md        # The challenge brief — what to build and why
  SOLUTION.md      # Reference solution + debrief
  start/           # A working app missing the challenge's feature
  solution/        # The completed implementation
```

- **`start/`** is always a running app. You can `npm install && npm run dev` and see it work. It's just missing the specific feature the challenge asks you to build.
- **`solution/`** is the reference implementation. Check it after you've attempted the challenge, or if you get stuck.
- Each challenge's `start/` is derived from the previous challenge's `solution/`, so the app grows progressively.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A code editor (VS Code recommended)
- A browser with React DevTools installed

### Start Your First Challenge

```bash
cd challenges/01-project-setup/start
npm install
npm run dev
```

Open the `README.md` in that challenge directory and follow the instructions.

### Working Through a Challenge

1. **Read the README.md** — understand the concept, the acceptance criteria, and the gotchas
2. **Run the start app** — `cd start && npm install && npm run dev` — explore what's already there
3. **Build the feature** — follow the challenge instructions, use the TODO comments in the code as guides
4. **Check acceptance criteria** — verify your implementation meets every criterion listed
5. **Compare with the solution** — read `SOLUTION.md` for the reference approach and debrief
6. **Move on** — the next challenge's `start/` picks up where this challenge's `solution/` left off

### Jumping to a Specific Challenge

Each challenge is self-contained. If you want to skip ahead:

```bash
cd challenges/15-tanstack-query/start
npm install
npm run dev
```

You don't need to complete prior challenges — every `start/` directory is a fully working app.

## Curriculum

### Phase 1: Foundation (Challenges 1–6)

Core mental models — components, props, state, and forms.

| # | Challenge | What You'll Learn |
|---|-----------|-------------------|
| 01 | [Project Setup](challenges/01-project-setup/) | Vite, TypeScript strict mode, project structure |
| 02 | [JSX & Components](challenges/02-jsx-components/) | Functional components, composition, semantic HTML |
| 03 | [Props & TypeScript](challenges/03-props-typescript/) | Typed props, interfaces, data flow |
| 04 | [Lists & Conditionals](challenges/04-lists-conditionals/) | `.map()`, keys, conditional rendering, empty states |
| 05 | [State with useState](challenges/05-state-usestate/) | Interactive UI, derived state, filtering |
| 06 | [Events & Forms](challenges/06-events-forms/) | Controlled inputs, validation, form submission |

**After Phase 1:** A static app with local state, forms, and filtering.

### Phase 2: Building (Challenges 7–15)

Primary patterns for structuring a real application.

| # | Challenge | What You'll Learn |
|---|-----------|-------------------|
| 07 | [Composition & Children](challenges/07-composition-children/) | Card, Modal, PageLayout — reusable containers |
| 08 | [Side Effects](challenges/08-side-effects/) | useEffect, cleanup, document title, keyboard shortcuts |
| 09 | [Custom Hooks](challenges/09-custom-hooks/) | Extracting reusable stateful logic |
| 10 | [Client-Side Routing](challenges/10-client-routing/) | React Router, pages, URL params, navigation |
| 11 | [Master-Detail Pattern](challenges/11-master-detail/) | Side-by-side layout, nested routes, URL-driven selection |
| 12 | [Context API](challenges/12-context-api/) | Theme and auth contexts, avoiding prop drilling |
| 13 | [useReducer](challenges/13-usereducer/) | Complex state, discriminated unions, status workflows |
| 14 | [Data Fetching](challenges/14-data-fetching/) | fetch + useEffect, loading/error states, MSW mock API |
| 15 | [TanStack Query](challenges/15-tanstack-query/) | Caching, query keys, stale time, background refetching |

**After Phase 2:** A routed app with master-detail layout, custom hooks, and API data.

### Phase 3: Integration (Challenges 16–22)

Connecting systems together.

| # | Challenge | What You'll Learn |
|---|-----------|-------------------|
| 16 | [Mutations & Optimistic Updates](challenges/16-mutations-optimistic/) | useMutation, optimistic UI, rollback, undo |
| 17 | [Zustand](challenges/17-zustand/) | Client state store, selectors, filter persistence |
| 18 | [Redux Toolkit](challenges/18-redux-toolkit/) | Slices, typed hooks, Immer, DevTools |
| 19 | [Performance](challenges/19-performance/) | React.memo, useMemo, useCallback, profiling |
| 20 | [Error Boundaries](challenges/20-error-boundaries/) | Isolation zones, fallback UI, error recovery |
| 21 | [Unit Testing](challenges/21-unit-testing/) | Vitest, React Testing Library, userEvent |
| 22 | [Async Testing](challenges/22-async-testing/) | MSW in tests, loading/error states, mutation testing |

**After Phase 3:** Full CRUD, state management, error handling, and a test suite.

### Phase 4: Refinement (Challenges 23–26)

Production concerns and the capstone.

| # | Challenge | What You'll Learn |
|---|-----------|-------------------|
| 23 | [Suspense & Lazy Loading](challenges/23-suspense-lazy/) | Code splitting, React.lazy, skeleton loaders |
| 24 | [Accessibility](challenges/24-accessibility/) | Focus traps, ARIA, keyboard navigation, contrast |
| 25 | [Deployment](challenges/25-deployment/) | Env variables, build optimization, static hosting |
| 26 | [Capstone](challenges/26-capstone/) | Team assignment, dashboard, polling — the final app |

**After Phase 4:** A code-split, accessible, deployed, complete TaskFlow application.

## Project Structure

```
react-fundamental-cycle/
├── README.md                    # This file
├── PROGRESS.md                  # Track your progress
├── challenges/
│   ├── 01-project-setup/
│   │   ├── README.md            # Challenge instructions
│   │   ├── SOLUTION.md          # Reference solution + debrief
│   │   ├── start/               # Your starting point
│   │   └── solution/            # Reference implementation
│   ├── 02-jsx-components/
│   │   └── ...
│   └── 26-capstone/
│       └── ...
└── shared/                      # Shared assets (referenced by later challenges)
    ├── types/                   # TypeScript interfaces
    ├── mock-api/                # MSW handlers and seed data
    └── styles/                  # Base CSS
```

## Tips

- **Don't skip the README.md.** The concept explanation and gotchas sections save you debugging time.
- **Run the start app first.** Understand what exists before you start coding.
- **Check acceptance criteria before looking at the solution.** They tell you exactly what "done" means.
- **Read SOLUTION.md even if you solved it.** The debrief covers edge cases and alternative approaches you might not have considered.
- **Use the TODO comments.** Every `start/` has comments marking exactly where to add code.
- **Each challenge is independent.** If you get stuck, you can always start the next challenge fresh from its `start/` directory.

## Running Tests (Challenges 21+)

Starting from Challenge 21, the solution directories include test suites:

```bash
cd challenges/21-unit-testing/solution
npm install
npm run test
```

## License

This workshop is for educational use.
