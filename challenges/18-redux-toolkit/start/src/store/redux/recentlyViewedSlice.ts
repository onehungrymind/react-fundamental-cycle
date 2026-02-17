// ============================================================
// Recently Viewed slice — CREATE THIS FILE FROM SCRATCH
// ============================================================
//
// Requirements:
//   State shape:  { projectIds: string[] }
//   Initial state: { projectIds: [] }
//
//   One reducer: addRecentlyViewed(state, action: PayloadAction<string>)
//     - Prepend action.payload to the list
//     - Remove any existing occurrence of action.payload (no duplicates)
//     - Keep only the most recent 5 entries (slice(0, 5))
//
// Hint — one-liner that satisfies all three requirements:
//   state.projectIds = [
//     action.payload,
//     ...state.projectIds.filter(id => id !== action.payload),
//   ].slice(0, 5)
//
// Exports needed:
//   export const { addRecentlyViewed } = recentlyViewedSlice.actions
//   export const recentlyViewedReducer = recentlyViewedSlice.reducer
//
// ============================================================

// TODO: implement this slice
