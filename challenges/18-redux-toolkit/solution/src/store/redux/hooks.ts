import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// ============================================================
// Typed hooks
//
// useSelector.withTypes<RootState>() creates a version of
// useSelector that already knows about our state shape.
// This means every call-site gets full autocomplete and type
// checking without having to annotate the selector callback.
//
// useDispatch.withTypes<AppDispatch>() does the same for dispatch,
// which is important when using createAsyncThunk — the typed
// dispatch understands async actions.
//
// Import these from this file in all components:
//   import { useAppSelector, useAppDispatch } from '../store/redux/hooks'
// ============================================================

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
