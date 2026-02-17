import { useCallback } from 'react'

export function useErrorHandler() {
  return useCallback((error: unknown) => {
    console.error('[useErrorHandler]', error)
  }, [])
}
