import { configureStore } from '@reduxjs/toolkit'
import { sidebarReducer } from './sidebarSlice'
import { filtersReducer } from './filtersSlice'
import { recentlyViewedReducer } from './recentlyViewedSlice'

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    filters: filtersReducer,
    recentlyViewed: recentlyViewedReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
