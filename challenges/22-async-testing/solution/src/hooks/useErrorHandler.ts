import { useState } from 'react'

export function useErrorHandler(): (error: Error) => void {
  const [error, setError] = useState<Error | null>(null)

  if (error !== null) {
    throw error
  }

  return setError
}
