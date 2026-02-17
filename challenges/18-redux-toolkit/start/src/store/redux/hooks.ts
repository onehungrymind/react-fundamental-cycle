import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// ============================================================
// Typed hooks
//
// Using .withTypes<T>() creates versions of useSelector and
// useDispatch that already know about our specific RootState
// and AppDispatch types.
//
// Import THESE hooks in your components instead of the plain
// useSelector / useDispatch from react-redux.
//
// Example usage:
//   const isCollapsed = useAppSelector((s) => s.sidebar.isCollapsed)
//   const dispatch = useAppDispatch()
//   dispatch(toggle())
// ============================================================

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
