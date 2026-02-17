import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ProjectStatus } from '../../types'

// ============================================================
// Filters slice
//
// Manages project list filter and sort preferences.
// These persist across navigation because they live in the
// Redux store (outside component lifecycle).
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
    // TODO: implement setStatusFilter
    // Replace state.statusFilter with action.payload.
    // The payload type is: ProjectStatus | 'all'
    setStatusFilter: (_state, _action: PayloadAction<ProjectStatus | 'all'>) => {
      // TODO: state.statusFilter = action.payload
    },

    // TODO: implement setSortOrder
    // Replace state.sortOrder with action.payload.
    // The payload type is: 'asc' | 'desc'
    setSortOrder: (_state, _action: PayloadAction<'asc' | 'desc'>) => {
      // TODO: state.sortOrder = action.payload
    },
  },
})

export const { setStatusFilter, setSortOrder } = filtersSlice.actions
export const filtersReducer = filtersSlice.reducer
