import { createSlice } from '@reduxjs/toolkit'

// ============================================================
// Sidebar slice
//
// Manages whether the app sidebar is collapsed or expanded.
// ============================================================

interface SidebarState {
  isCollapsed: boolean;
}

const initialState: SidebarState = {
  isCollapsed: false,
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    // TODO: implement toggle
    // Flip state.isCollapsed (true → false, false → true).
    // Immer is built-in: you can mutate `state` directly.
    toggle: (_state) => {
      // TODO: state.isCollapsed = ...
    },

    // TODO: implement collapse
    // Set state.isCollapsed = true.
    collapse: (_state) => {
      // TODO
    },

    // TODO: implement expand
    // Set state.isCollapsed = false.
    expand: (_state) => {
      // TODO
    },
  },
})

// Export the action creators so components can dispatch them:
//   dispatch(toggle())
//   dispatch(collapse())
//   dispatch(expand())
export const { toggle, collapse, expand } = sidebarSlice.actions

// Export the reducer to be registered in store.ts
export const sidebarReducer = sidebarSlice.reducer
