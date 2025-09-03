import { useState, useCallback } from 'react'

export interface UseErrorHandlerReturn {
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void
  handleError: (error: unknown) => void
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((error: unknown) => {
    console.error('Error occurred:', error)

    if (error instanceof Error) {
      setError(error.message)
    } else if (typeof error === 'string') {
      setError(error)
    } else {
      setError('An unexpected error occurred')
    }
  }, [])

  return {
    error,
    setError,
    clearError,
    handleError
  }
}
