import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ProjectStatus } from '../../types'

// ============================================================
// Filters slice
//
// Manages project list filter and sort preferences.
// These persist across navigation because they live in the
// Redux store (outside component lifecycle), just like they
// did in the Zustand store in challenge 17.
// ============================================================

interface FiltersState {
  statusFilter: ProjectStatus | 'all';
  sortOrder: 'asc' | 'desc';
}

const initialState: FiltersState = {
  statusFilter: 'all',
  sortOrder: 'asc',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<ProjectStatus | 'all'>) => {
      state.statusFilter = action.payload
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload
    },
  },
})

export const { setStatusFilter, setSortOrder } = filtersSlice.actions
export const filtersReducer = filtersSlice.reducer
