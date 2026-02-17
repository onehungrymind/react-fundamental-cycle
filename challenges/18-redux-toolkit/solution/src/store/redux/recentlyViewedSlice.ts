import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// ============================================================
// Recently Viewed slice
//
// Keeps a list of the last 5 project IDs the user visited,
// most recent first.
//
// Rules:
//   - New IDs are prepended (most recent = index 0)
//   - Duplicate IDs are removed before prepending
//   - The list is capped at 5 entries
// ============================================================

interface RecentlyViewedState {
  projectIds: string[];
}

const initialState: RecentlyViewedState = {
  projectIds: [],
}

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addRecentlyViewed: (state, action: PayloadAction<string>) => {
      // Prepend, deduplicate, then cap at 5.
      // Immer allows us to reassign state.projectIds directly.
      state.projectIds = [
        action.payload,
        ...state.projectIds.filter((id) => id !== action.payload),
      ].slice(0, 5)
    },
  },
})

export const { addRecentlyViewed } = recentlyViewedSlice.actions
export const recentlyViewedReducer = recentlyViewedSlice.reducer
