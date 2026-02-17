# Challenge 07 — Solution Debrief

## What You Built

Three reusable container components — `Card`, `Modal`, and `PageLayout` — that
rely on `children` and named ReactNode slots instead of encoding every detail
in data props. You also refactored `ProjectCard` to use `Card` internally and
moved the inline `AddProjectForm` into a portal-based `Modal`.

---

## Composition vs Configuration

The **configuration** approach passes data props to control what a component
renders:

```tsx
<ProjectCard
  name="Website Redesign"
  status="active"
  description="..."
  taskCount={5}
/>
```

The **composition** approach passes JSX as children so the caller controls
the structure:

```tsx
<Card
  title="Website Redesign"
  footer={<MetaRow taskCount={5} />}
>
  <p>Complete overhaul of the company website.</p>
</Card>
```

Neither is universally better. Configuration is simpler when the structure is
fixed. Composition wins when callers need to customise inner structure without
the container knowing the details.

---

## `children: React.ReactNode`

`React.ReactNode` is the correct type for the `children` prop. It covers:

- `React.ReactElement` (JSX expressions)
- `string`, `number`, `boolean`
- `null`, `undefined`
- Arrays of any of the above

Avoid `React.FC` or `React.PropsWithChildren` — typing props explicitly is
clearer and more flexible in TypeScript strict mode.

---

## Named Slots via Props

When a component needs multiple distinct areas of content, use additional
`React.ReactNode` props alongside `children`:

```tsx
interface CardProps {
  title?: string;       // simple string slot — rendered as an h3
  footer?: React.ReactNode; // rich slot — anything can go here
  children: React.ReactNode;
}
```

This is the "named slots" pattern. Other frameworks call these slots, portals,
or transclusion. In React they are just props.

---

## `ReactDOM.createPortal`

```tsx
import ReactDOM from 'react-dom'

return ReactDOM.createPortal(
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
      {/* content */}
    </div>
  </div>,
  document.body
)
```

The portal renders the JSX into `document.body` rather than the component's
parent DOM node. This sidesteps any `overflow: hidden` or `z-index` stacking
context on ancestor elements — a common cause of modal rendering bugs.

---

## Event Bubbling Through the React Tree

Even though the portal's DOM is attached directly to `document.body`, React
synthetic events still bubble through the **React component tree** (not the
DOM tree). This means:

1. A click on the dialog fires `onClick` on both the dialog and the backdrop
   (because the dialog is a React child of the backdrop).
2. `e.stopPropagation()` on the dialog's `onClick` stops the event from
   reaching the backdrop's `onClick`.

This is intentional React behaviour and makes portal event handling feel
consistent with non-portal components.

---

## When `children` Can Be `undefined`

`children` is optional in React 18+. If a consumer forgets to pass children,
the prop is `undefined`. Rendering `undefined` in JSX is safe — React renders
nothing. But if you need to check whether children were provided (e.g. to
avoid rendering a wrapper element), use:

```tsx
import { Children } from 'react'

if (Children.count(props.children) === 0) { ... }
```

---

## Render Props (Preview)

A related pattern is **render props** — passing a function as a prop instead
of JSX. The component calls the function to get the content:

```tsx
<DataList
  items={projects}
  renderItem={(project) => <ProjectCard key={project.id} {...project} />}
/>
```

This is useful when the child needs data from the parent to render correctly.
You will explore this pattern in a later challenge.

---

## Compound Components (Preview)

Compound components are a more advanced composition pattern where a parent
component provides context and child components read from it:

```tsx
<Tabs>
  <Tabs.List>
    <Tabs.Tab value="active">Active</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="active">...</Tabs.Panel>
</Tabs>
```

The `Tabs.Tab` and `Tabs.Panel` subcomponents are properties of `Tabs` and
share implicit state via React context. You will build this in a later
challenge.

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Forgetting `e.stopPropagation()` on the modal dialog | Clicking anywhere inside the modal closes it |
| Using `React.FC` with implicit children | In React 18+, `children` is not implicit — add it to the interface |
| Putting `createPortal` outside the conditional | Always guard with `if (!isOpen) return null` before the portal |
| Duplicate card markup in `ProjectCard` | Remove the `article.project-card` wrapper; let `Card` provide it |
| Typing `footer` as `string` | Use `React.ReactNode` so any JSX can be passed |
