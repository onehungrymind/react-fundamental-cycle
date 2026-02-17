import { configureStore } from '@reduxjs/toolkit'
import { sidebarReducer } from './sidebarSlice'
import { filtersReducer } from './filtersSlice'
import { recentlyViewedReducer } from './recentlyViewedSlice'

// ============================================================
// Redux store
//
// configureStore wires all slice reducers into a single store.
// It also sets up the Redux DevTools Extension automatically —
// no extra configuration needed.
// ============================================================

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    filters: filtersReducer,
    recentlyViewed: recentlyViewedReducer,
  },
})

// RootState is the type of the full state tree.
// It is derived automatically from the store so it stays
// in sync whenever slices are added or changed.
export type RootState = ReturnType<typeof store.getState>

// AppDispatch includes the types for all middleware (thunks, etc.)
// Using this type (rather than plain `Dispatch`) means TypeScript
// understands async thunks if you add them later.
export type AppDispatch = typeof store.dispatch
