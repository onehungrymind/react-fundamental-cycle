# Solution Debrief — Challenge 04: Rendering Lists & Conditional Rendering

## What Changed from the Start

| File | Change |
|---|---|
| `src/components/MainContent.tsx` | Array expanded to 5 projects; hardcoded cards replaced by `.map()` with `key={project.id}`; empty-state conditional added |
| `src/components/ProjectCard.tsx` | `isOverdue` flag derived from `dueDate`; "⚠ Overdue" indicator added |
| `src/App.css` | `.empty-state` and `.project-card__overdue` styles added |

---

## 1. Keys: the Right Way

```tsx
// Good — stable, unique id from the data
{projects.map((project) => (
  <ProjectCard key={project.id} {...project} />
))}

// Bad — index as key (breaks when list is reordered or filtered)
{projects.map((project, i) => (
  <ProjectCard key={i} {...project} />
))}
```

React's reconciler uses `key` to match old and new virtual-DOM nodes. When the key
is stable and unique, React moves existing DOM nodes rather than recreating them,
preserving internal state (text inputs, focus, animations). When you use index as
key and the list changes order, React remounts components unnecessarily and can
corrupt state.

**Rule of thumb:** always use an `id` that comes from your data.

---

## 2. Deriving `isOverdue` — No Extra State Needed

```tsx
const isOverdue =
  dueDate !== undefined && new Date(dueDate) < new Date();
```

This is a pure computation from props — no `useState`, no `useEffect`. Derived
values should almost always be plain variables, not state. Adding them to state
creates synchronisation bugs (you have to keep two values in sync manually).

The comparison `new Date(dueDate) < new Date()` works because JavaScript's `Date`
constructor parses ISO-8601 strings (`"2024-12-01"`) correctly, and `<` on Date
objects compares their numeric millisecond timestamps.

---

## 3. Conditional Rendering Patterns

### `&&` — render only when true

```tsx
{isOverdue && <span className="project-card__overdue">⚠ Overdue</span>}
```

`isOverdue` is already a `boolean`, so there is no risk of rendering a falsy
primitive. The expression short-circuits: when `isOverdue` is `false`, nothing
is rendered; when it is `true`, the `<span>` is rendered.

### The `0` bug with `&&`

```tsx
// taskCount = 0 → renders the text "0" to the DOM
{taskCount && <span>{taskCount} tasks</span>}

// Fix: convert to boolean first
{taskCount > 0 && <span>{taskCount} tasks</span>}
// or
{!!taskCount && <span>{taskCount} tasks</span>}
```

React renders all non-boolean falsy values (`0`, `""`, `NaN`) as text nodes.
Only `false`, `null`, and `undefined` are silently skipped.

### Ternary — render one thing OR another

```tsx
{projects.length === 0 ? (
  <p className="empty-state">No projects yet. Create your first project!</p>
) : (
  <div className="project-grid">
    {projects.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </div>
)}
```

Use ternary when you have two mutually exclusive branches. Prefer `&&` for the
simple "show this or nothing" case to keep JSX readable.

---

## 4. Early Return Pattern (Alternative)

For more complex conditions you can use an early return in the component body:

```tsx
export function MainContent() {
  if (projects.length === 0) {
    return (
      <main className="app-main">
        <div className="main-inner">
          <p className="empty-state">No projects yet. Create your first project!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-main">
      <div className="main-inner">
        <h2 className="main-heading">Projects</h2>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </main>
  );
}
```

Early returns work best when the "special" branch is short and the "normal" branch
is long. The ternary approach is fine when both branches are similar in length.

---

## 5. Render Functions (Extracting Complex JSX)

When your conditional branches become long, extract them into named functions
or components:

```tsx
function ProjectList({ projects }: { projects: ProjectCardProps[] }) {
  if (projects.length === 0) {
    return <p className="empty-state">No projects yet. Create your first project!</p>;
  }
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
```

This keeps `MainContent` clean and makes the rendering logic independently
testable. The `ProjectList` helper is a proper React component (capitalised,
returns JSX) — React will reconcile it correctly.

---

## 6. TypeScript Notes

- `status: "active" as const` in the projects array prevents TypeScript from
  widening the type to `string`. Without `as const` the compiler infers
  `status: string` which does not match the union `'active' | 'completed' | 'archived'`.

- The `dueDate` prop is `string | undefined`. Before calling `new Date(dueDate)`
  you must narrow it: `dueDate !== undefined && …` handles this cleanly.

- Setting `noUncheckedSideEffectImports` in `tsconfig.app.json` prevents accidental
  side-effect-only imports that TypeScript would otherwise ignore.

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| `key={index}` | Use `key={project.id}` |
| `{taskCount && …}` when `taskCount` could be `0` | `{taskCount > 0 && …}` |
| Calling `new Date(dueDate)` without checking for `undefined` | `dueDate !== undefined && new Date(dueDate) < new Date()` |
| Forgetting `as const` on string literal status values | Add `as const` or type the array as `ProjectCardProps[]` |
| Putting derived data (`isOverdue`) in `useState` | Plain `const` — derive it from props directly |

---

## What's Next

Challenge 05 introduces `useState` — you will add the ability to filter projects by
status. The array and the `.map()` rendering you built here will remain; you will
just filter the array before mapping over it.
