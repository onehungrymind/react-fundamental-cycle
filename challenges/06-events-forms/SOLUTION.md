# Solution Debrief — Challenge 06: Event Handling & Forms

## What Changed from the Start

| File | Change |
|---|---|
| `src/types/index.ts` | `ProjectFormData` and `FormErrors` interfaces added |
| `src/components/AddProjectForm.tsx` | **New component** — controlled form with validation |
| `src/components/MainContent.tsx` | `showForm` state added; `handleAddProject` callback; "New Project" button; `AddProjectForm` rendered conditionally |
| `src/App.css` | Form styles added (`.add-project-form`, `.form-group`, `.form-label`, `.form-input`, `.form-textarea`, `.form-select`, `.form-error`, `.form-actions`) |

---

## 1. Controlled Inputs — How They Work

A controlled input has two parts:

```tsx
<input
  value={formData.name}                // React sets the displayed value
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
```

1. On every keystroke, the browser fires an `onChange` event.
2. The handler calls `setFormData`, updating React state.
3. React re-renders the component; the new `formData.name` value flows back
   into the `value` prop.
4. The input now displays exactly what is in React state.

If you provide `value` without `onChange`, React locks the input — the user
cannot type. If you omit `value`, the input is uncontrolled and React has no
idea what it contains.

---

## 2. Single Form State Object

```tsx
const INITIAL_FORM: ProjectFormData = {
  name: '',
  description: '',
  status: 'active',
  dueDate: '',
};

const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM);
```

Updating one field without losing the others requires a spread:

```tsx
setFormData({ ...formData, name: e.target.value });
```

`{ ...formData }` copies all existing fields, then `name: e.target.value`
overwrites just the `name` property.

Resetting is a single call:

```tsx
setFormData(INITIAL_FORM);
```

---

## 3. Event Types

TypeScript enforces that event handler types match the element:

```ts
// form onSubmit
(e: React.FormEvent<HTMLFormElement>) => void

// <input type="text"> onChange
(e: React.ChangeEvent<HTMLInputElement>) => void

// <textarea> onChange
(e: React.ChangeEvent<HTMLTextAreaElement>) => void

// <select> onChange
(e: React.ChangeEvent<HTMLSelectElement>) => void
```

All of these expose `e.target.value` as a `string`. The `<select>` change
handler casts the value to `ProjectStatus` because TypeScript cannot infer
that the option values match the union type:

```tsx
onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
  setFormData({ ...formData, status: e.target.value as ProjectStatus })
}
```

This is the one `as` cast in the file — acceptable because we control the
`<option>` values and they are guaranteed to match.

---

## 4. e.preventDefault()

```tsx
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();  // stop default browser form submission
  // ...
}
```

Without this, the browser would serialize the form and make an HTTP request,
reloading the page and losing all React state. Always call it first in an
`onSubmit` handler.

---

## 5. Validation Pattern

```tsx
const newErrors: FormErrors = {};

if (formData.name.trim().length < 3) {
  newErrors.name = 'Project name is required (minimum 3 characters)';
}
if (formData.description.trim() === '') {
  newErrors.description = 'Description is required';
}

if (Object.keys(newErrors).length > 0) {
  setErrors(newErrors);
  return;        // early return — do not submit
}
```

Build the errors object fresh on every submit attempt. If it is non-empty,
store it in state (which re-renders the component, showing the messages) and
return. If it is empty, proceed.

Displaying an error:

```tsx
{errors.name && (
  <p className="form-error" role="alert">{errors.name}</p>
)}
```

`role="alert"` causes screen readers to announce the error immediately.

---

## 6. Adding to Array State

```tsx
function handleAddProject(data: ProjectFormData) {
  const newProject: ProjectCardProps = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    status: data.status,
    taskCount: 0,
    dueDate: data.dueDate || undefined,
  };
  setProjects((prev) => [...prev, newProject]);
  setShowForm(false);
}
```

Key points:

- `crypto.randomUUID()` produces a UUID v4 — no external dependency needed.
- `[...prev, newProject]` creates a **new array** — never mutate state directly
  with `push`.
- Using the functional update form `(prev) => ...` is safer when the new state
  depends on the previous state.

---

## 7. Toggling Form Visibility

```tsx
const [showForm, setShowForm] = useState(false);

// Show:
<button onClick={() => setShowForm(true)}>New Project</button>

// Hide from inside the form:
<button type="button" onClick={onCancel}>Cancel</button>

// The form passes onCancel through:
<AddProjectForm
  onAddProject={handleAddProject}
  onCancel={() => setShowForm(false)}
/>
```

`type="button"` on the Cancel button is important — without it, a button
inside a `<form>` defaults to `type="submit"` and would trigger `handleSubmit`.

---

## 8. Form Reset

After a successful submission, reset both the form data and the errors:

```tsx
setFormData(INITIAL_FORM);
setErrors({});
```

Resetting `errors` clears any validation messages that were showing.

---

## Alternate Approaches

### React Hook Form

For larger forms, [React Hook Form](https://react-hook-form.com/) reduces
boilerplate significantly. It uses uncontrolled inputs by default (via `ref`)
and provides built-in validation, error objects, and a `reset()` function.

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>();
```

### useRef (uncontrolled)

```tsx
const nameRef = useRef<HTMLInputElement>(null);

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const name = nameRef.current?.value ?? '';
  // validate and submit...
}

<input ref={nameRef} type="text" />
```

Uncontrolled inputs are simpler to write for read-once forms (e.g. a search
box), but they make live validation, dependent fields, and testing harder.
Prefer controlled inputs for any form that needs real-time feedback.

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| `value` without `onChange` | Input becomes read-only; add the handler |
| Forgetting `e.preventDefault()` | Page reloads on submit |
| Mutating state: `formData.name = value` | Use spread: `setFormData({ ...formData, name: value })` |
| `<button>Cancel</button>` inside `<form>` | Add `type="button"` to prevent form submission |
| `type="submit"` on Cancel button | Use `type="button"` |
| Using `push` to add to array state | Use `[...prev, newItem]` to return a new array |
| Casting select value with `as any` | Cast to the specific union type: `as ProjectStatus` |

---

## What's Next

Challenge 07 introduces `useEffect` — you will synchronise the active filter
to `localStorage` so it persists across page refreshes, and learn how React
interacts with systems outside the component tree.
