import { createSlice } from '@reduxjs/toolkit'

// ============================================================
// Sidebar slice
//
// Manages whether the app sidebar is collapsed or expanded.
//
// createSlice wraps the reducers with Immer's `produce`, so
// we can mutate `state` directly.  The actual state object is
// never mutated — Immer intercepts the write and produces a
// new immutable state value.
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
    toggle: (state) => {
      state.isCollapsed = !state.isCollapsed
    },
    collapse: (state) => {
      state.isCollapsed = true
    },
    expand: (state) => {
      state.isCollapsed = false
    },
  },
})

export const { toggle, collapse, expand } = sidebarSlice.actions
export const sidebarReducer = sidebarSlice.reducer
