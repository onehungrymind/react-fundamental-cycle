import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ProjectStatus } from '../../types'

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
