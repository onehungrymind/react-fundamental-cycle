# Challenge 13: Lift State Up

## Phase 3: Scaling State

### Objective
Move selected item state up in the component hierarchy so multiple children can read and update it.

### Requirements
- Move selection state to a common parent component
- Pass state and setter functions as props to children
- Ensure multiple components can access the same state
- Maintain proper prop drilling patterns
- Keep components properly decoupled

### Expected Outcome
- Centralized state management
- Multiple components sharing the same state
- Proper prop drilling implementation
- Clean component hierarchy

### Learning Goals
- State lifting patterns
- Prop drilling
- Component hierarchy design
- Shared state management

### Next Steps
This state lifting approach will be enhanced with Context API to avoid deep prop drilling.
