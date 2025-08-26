# React Master–Detail: 30 Challenges

This document outlines the 30 progressive challenges that evolve a simple master–detail view into a fully reactive, well-architected, tested React application with container–presenter separation, state management, API integration, and testing.

---

## Phase 1: Static UI Foundations
1. **Static Master–Detail Layout** — Single component renders hardcoded list and a default detail view.  
2. **Reusable ListItem Component** — Extract `ListItem` presenter; use props for title/description.  
3. **Conditional Detail View** — Show detail only when an item is selected; otherwise show placeholder.  
4. **Render Dynamic Lists** — Move hardcoded items to an array; render with `.map()` using keys.  
5. **Composition with Card** — Create `Card` presenter; compose Detail inside Card using children.  
6. **Styling the UI** — Add simple styles to separate list from detail and establish layout.  

---

## Phase 2: Adding Interactivity (Local State)
7. **Selectable List Items** — Add click handler to select an item; store `activeId` in state.  
8. **Controlled Filter Input** — Add a search input to filter items by title.  
9. **Form to Add New Items** — Add a controlled form to append new items to the list.  
10. **Immutability in Updates** — Ensure array/object updates are immutable.  
11. **Derived State Discipline** — Compute derived values instead of storing them.  
12. **Reset Detail on Filter Change** — Reset active detail when the filter changes.  

---

## Phase 3: Scaling State
13. **Lift State Up** — Move selected item state up so multiple children can read it.  
14. **Context vs Prop Drilling** — Replace deep prop passing with React Context.  
15. **useReducer for Complex Updates** — Manage list + detail transitions with a reducer.  
16. **Context + Reducer** — Combine Context and Reducer for global app state.  
17. **Container–Presenter Split** — Refactor: presenters are pure, containers manage state/effects.  

---

## Phase 4: Remote Data & Effects
18. **Remote List Fetch** — Replace local data with `GET /api/items`; add loading/error/empty states.  
19. **Remote Detail Fetch** — Fetch detail on selection (simulate with filter or route param).  
20. **Persist New Item** — `POST` new items to `/api/items`; refresh list on success.  
21. **Optimistic Updates** — Optimistically add an item, then reconcile with the server.  

---

## Phase 5: Advanced State Management
22. **Route-Based Selection** — Introduce routing (`/items` and `/items/[id]`); sync selection with URL.  
23. **Redux Toolkit Store** — Create an RTK store for selection and filter state.  
24. **Selectors & Normalization** — Normalize items by id; create memoized selectors.  
25. **Async Thunks for API** — Move fetch/POST logic into async thunks.  
26. **RTK Query Caching** — Replace thunks with RTK Query for caching and invalidation.  

---

## Phase 6: Forms & Testing
27. **Multi-Step Form** — Create a wizard for adding new items (basic → details → confirm).  
28. **Basic Testing** — Add Jest + RTL tests for presenters.  
29. **Integration Testing** — Test fetching list (mocked) and selecting an item.  
30. **End-to-End Testing** — Add Playwright spec for list → select → detail → add item flow.  

---

✅ By the end of these challenges, you’ll have built a **scalable master–detail React app** with:
- Container–presenter separation
- State management (local → context → reducer → Redux Toolkit → RTK Query)
- Remote data fetching with optimistic updates
- Routing, forms, and multi-step workflows
- Testing pyramid (unit → integration → e2e)