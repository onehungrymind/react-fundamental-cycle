import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

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
      state.projectIds = [
        action.payload,
        ...state.projectIds.filter((id) => id !== action.payload),
      ].slice(0, 5)
    },
  },
})

export const { addRecentlyViewed } = recentlyViewedSlice.actions
export const recentlyViewedReducer = recentlyViewedSlice.reducer
