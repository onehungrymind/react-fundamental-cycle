import { createSlice } from '@reduxjs/toolkit'

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
