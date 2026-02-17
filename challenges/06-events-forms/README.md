# Challenge 06 — Event Handling & Forms

## Overview

The project list in TaskFlow is currently hardcoded. In this challenge you will
build an **Add Project** form that lets users create new projects at runtime.

You will practice:

- Controlled inputs (every field's value lives in React state)
- Handling DOM events with correct TypeScript event types
- Calling `e.preventDefault()` to stop the default form submission
- Client-side validation with inline error messages
- Updating an array in state to add a new item

---

## Learning Objectives

1. Store all form field values in a single state object.
2. Write `onChange` handlers for `<input>`, `<textarea>`, and `<select>`.
3. Use the correct React event types:
   - `React.FormEvent<HTMLFormElement>` for `onSubmit`
   - `React.ChangeEvent<HTMLInputElement>` for text/date inputs
   - `React.ChangeEvent<HTMLTextAreaElement>` for textareas
   - `React.ChangeEvent<HTMLSelectElement>` for selects
4. Run validation on submit and display inline error messages.
5. Call a parent callback to add the new project to the list.
6. Reset the form after a successful submission.

---

## Starting Point

The `start/` directory is based on Challenge 05's solution. It already:

- Renders 5 projects with filtering (All / Active / Completed / Archived)
- Stores the projects array in `useState` (ready to be extended)
- Has a stub `AddProjectForm.tsx` with a `// TODO` comment

There is **no working form yet**. Your job is to build it.

Run the start app to verify it works before you begin:

```bash
cd start
npm install
npm run dev
```

---

## Your Tasks

Work inside `start/src/`. You may edit any file.

### 1 — Add the form types to `src/types/index.ts`

```ts
export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
}

export interface FormErrors {
  name?: string;
  description?: string;
}
```

### 2 — Implement `AddProjectForm.tsx`

The component receives two props:

```ts
interface AddProjectFormProps {
  onAddProject: (data: ProjectFormData) => void;
  onCancel: () => void;
}
```

#### Form state

Store all field values in a single state object:

```tsx
const [formData, setFormData] = useState<ProjectFormData>({
  name: '',
  description: '',
  status: 'active',
  dueDate: '',
});
```

Store validation errors in a separate state object:

```tsx
const [errors, setErrors] = useState<FormErrors>({});
```

#### Controlled inputs

Every input must have both `value` and `onChange`:

```tsx
<input
  type="text"
  id="name"
  value={formData.name}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, name: e.target.value })
  }
/>
```

Use the same pattern for `<textarea>` (with `React.ChangeEvent<HTMLTextAreaElement>`)
and `<select>` (with `React.ChangeEvent<HTMLSelectElement>`).

#### Fields to include

| Field | Element | Type | Required |
|---|---|---|---|
| Project Name | `<input>` | `text` | Yes |
| Description | `<textarea>` | — | Yes |
| Status | `<select>` | — | Yes (default `"active"`) |
| Due Date | `<input>` | `date` | No |

#### Validation on submit

In `handleSubmit`, call `e.preventDefault()` first, then validate:

- `name`: required and at least 3 characters → `"Project name is required (minimum 3 characters)"`
- `description`: required → `"Description is required"`

If there are errors, update the `errors` state and return early. Do **not** call
`onAddProject`.

If validation passes, call `onAddProject(formData)` and reset the form.

### 3 — Update `MainContent.tsx`

The `projects` array is already stored in `useState`. You need to:

1. Add a `showForm` boolean state, initially `false`.
2. Write a `handleAddProject` function that:
   - Generates a unique id with `crypto.randomUUID()`
   - Adds the new project to the list (set `taskCount` to `0`)
   - Hides the form by setting `showForm` to `false`
3. Add a "New Project" button above the filter bar that sets `showForm` to `true`.
4. Conditionally render `<AddProjectForm>` when `showForm` is `true`, passing
   `onAddProject={handleAddProject}` and `onCancel={() => setShowForm(false)}`.

---

## Acceptance Criteria

- [ ] "New Project" button appears above the filter bar
- [ ] Clicking it shows the `AddProjectForm`
- [ ] All four inputs are controlled (value + onChange)
- [ ] Submitting with an empty name shows the validation error message
- [ ] Submitting with a name shorter than 3 characters shows the error message
- [ ] Submitting with an empty description shows the validation error message
- [ ] A valid submission adds the project to the list and hides the form
- [ ] The form resets to empty values after a successful submission
- [ ] The new project appears in the list immediately (filtered correctly)
- [ ] "Cancel" closes the form without adding a project
- [ ] No TypeScript errors (`npm run build` passes)

---

## Key Concepts

### Controlled inputs

An input is **controlled** when React owns the value:

```tsx
<input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
```

An **uncontrolled** input manages its own value via the DOM:

```tsx
<input ref={nameRef} />  // read nameRef.current.value when needed
```

Controlled inputs are the React default because they make the form state
inspectable and testable at any time.

### Single form state object

Storing all fields in one object avoids having five separate `useState` calls
and makes it easy to spread-reset the form to its initial values:

```tsx
const INITIAL_FORM: ProjectFormData = { name: '', description: '', status: 'active', dueDate: '' };
const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM);

// Reset:
setFormData(INITIAL_FORM);
```

### e.preventDefault()

HTML forms submit to the server by default, causing a full page reload.
Calling `e.preventDefault()` in the `onSubmit` handler stops that behaviour
so React can handle the submission entirely in the browser.

### Event types

TypeScript requires you to be specific about which element fired the event:

```ts
React.FormEvent<HTMLFormElement>       // form onSubmit
React.ChangeEvent<HTMLInputElement>    // input onChange
React.ChangeEvent<HTMLTextAreaElement> // textarea onChange
React.ChangeEvent<HTMLSelectElement>   // select onChange
```

---

## Running the App

```bash
cd start
npm install
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

To check the TypeScript build:

```bash
npm run build
```
