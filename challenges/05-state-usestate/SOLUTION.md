# Solution Debrief — Challenge 05: State with useState

## What Changed from the Start

| File | Change |
|---|---|
| `src/types/index.ts` | `ProjectStatus` type extracted and exported; `ProjectCardProps.status` updated to use it |
| `src/components/StatusFilter.tsx` | **New component** — renders 4 filter buttons, applies `.active` class to the selected one |
| `src/components/MainContent.tsx` | `useState` added for `activeFilter`; `filteredProjects` derived with `.filter()`; count line added; `StatusFilter` rendered |
| `src/App.css` | Filter bar styles added (`.filter-bar`, `.filter-btn`, `.filter-btn.active`, `.filter-count`) |

---

## 1. useState — the Basics

```tsx
const [activeFilter, setActiveFilter] = useState<ProjectStatus | "all">("all");
```

- `useState` returns a **tuple**: `[currentValue, updaterFunction]`
- Destructuring with `const [a, b]` is the idiomatic way to name them
- The generic `<ProjectStatus | "all">` tells TypeScript the exact type of the state; without it the type would be inferred as `"all"` (too narrow) or `string` (too wide)
- `"all"` is the **initial value** — used only on the first render, ignored afterwards

### What happens when you call the updater

```tsx
setActiveFilter("active");   // 1. schedules a re-render
                              // 2. React re-runs MainContent()
                              // 3. activeFilter is now "active"
                              // 4. filteredProjects is recomputed
                              // 5. React reconciles the DOM
```

The component function runs again from top to bottom. All `const` variables
(including `filteredProjects`) are recomputed from scratch on every render.

---

## 2. Derived State — The Most Important Lesson

```tsx
// Derived during render — correct
const filteredProjects =
  activeFilter === "all"
    ? projects
    : projects.filter((p) => p.status === activeFilter);
```

This is **not** state. It is a plain `const` computed from `activeFilter` (state)
and `projects` (module-level constant). Every time `activeFilter` changes, React
re-runs the component function, `filteredProjects` is recomputed, and the new
filtered list is rendered.

Storing `filteredProjects` in `useState` would be wrong:

```tsx
// Wrong — creates a synchronisation problem
const [filteredProjects, setFilteredProjects] = useState(projects);

// Now you need a useEffect or to call setFilteredProjects manually every
// time activeFilter changes. Two pieces of state that must always agree
// with each other = a bug waiting to happen.
```

**Rule:** if a value can be computed from existing state or props, it is a
derived value. Express it as a `const`, not `useState`.

---

## 3. Passing State Down as Props

`MainContent` owns the state. `StatusFilter` reads and changes it via props:

```tsx
// MainContent.tsx
<StatusFilter
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
/>
```

```tsx
// StatusFilter.tsx
interface StatusFilterProps {
  activeFilter: ProjectStatus | "all";
  onFilterChange: (filter: ProjectStatus | "all") => void;
}
```

Passing `setActiveFilter` directly as `onFilterChange` works because
`setActiveFilter` has the signature `(value: ProjectStatus | "all") => void`,
which matches the prop type exactly.

This pattern — declare state in a parent, pass value + setter to a child — is
called **lifting state up**. It keeps the single source of truth in the parent
while letting the child read and update it.

---

## 4. Conditional CSS Classes

```tsx
<button
  className={activeFilter === filter ? "filter-btn active" : "filter-btn"}
  onClick={() => onFilterChange(filter)}
>
  {label}
</button>
```

Or with a template literal:

```tsx
className={`filter-btn${activeFilter === filter ? " active" : ""}`}
```

Both are idiomatic. The template literal version is useful when the base class
is long or there are multiple conditional additions.

---

## 5. Rendering the Count

```tsx
<p className="filter-count">
  Showing {filteredProjects.length} of {projects.length} projects
</p>
```

Both values are just numbers — no state needed. They update automatically
because they are derived from `filteredProjects` (which is derived from
`activeFilter`) and `projects` (which never changes).

---

## 6. TypeScript: Typing State

```tsx
useState<ProjectStatus | "all">("all")
```

The generic parameter constrains both the state value and the updater's argument.
TypeScript will reject any attempt to call `setActiveFilter` with a value that
is not `ProjectStatus | "all"`:

```tsx
setActiveFilter("pending");  // Type error — "pending" is not assignable
setActiveFilter("active");   // OK
setActiveFilter("all");      // OK
```

---

## 7. Batching (React 18+)

If you called two state setters back-to-back:

```tsx
setActiveFilter("active");
setSomethingElse(42);
```

React 18 **batches** both updates into a single re-render. The component
function runs once, not twice. This is automatic — you do not need to do
anything special.

---

## 8. Lazy Initialisation (Advanced)

When the initial state value is expensive to compute, pass a function to
`useState` instead of a value:

```tsx
// This runs filterExpensiveData() on every render — wasteful
const [data, setData] = useState(filterExpensiveData());

// This runs filterExpensiveData() only on the first render — correct
const [data, setData] = useState(() => filterExpensiveData());
```

This is not needed here (our initial value `"all"` is a literal), but it is
worth knowing for cases involving large data transformations or reading from
`localStorage`.

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Storing `filteredProjects` in `useState` | Derive it as a `const` from `activeFilter` |
| Forgetting the generic: `useState("all")` | Add `<ProjectStatus \| "all">` so the type is not narrowed to `"all"` |
| Mutating state directly: `activeFilter = "active"` | Always call the setter: `setActiveFilter("active")` |
| Passing `() => setActiveFilter` instead of `setActiveFilter` | Pass the function reference, not a wrapper: `onFilterChange={setActiveFilter}` |
| Comparing with `===` then rendering `"0"` with `&&` | Check counts with `> 0` or use ternary |

---

## What's Next

Challenge 06 introduces `useEffect` — you will persist the active filter to
`localStorage` so it survives a page refresh, and learn how React synchronises
components with external systems.
