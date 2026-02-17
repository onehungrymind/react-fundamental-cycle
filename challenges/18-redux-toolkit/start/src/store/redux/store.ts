import { configureStore } from '@reduxjs/toolkit'
import { sidebarReducer } from './sidebarSlice'
import { filtersReducer } from './filtersSlice'
// TODO: import recentlyViewedReducer once you have created recentlyViewedSlice.ts
// import { recentlyViewedReducer } from './recentlyViewedSlice'

// TODO: Register all three reducers with configureStore.
// The current setup only has sidebar + filters — add recentlyViewed once the
// slice file is complete.
export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    filters: filtersReducer,
    // recentlyViewed: recentlyViewedReducer,
  },
})

// Derive the RootState and AppDispatch types automatically from the store.
// Export them so the typed hooks in hooks.ts can reference them.
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
