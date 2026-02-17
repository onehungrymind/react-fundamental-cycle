import { useEffect } from 'react'

export function useKeyboardShortcut(
  key: string,
  handler: (e: KeyboardEvent) => void,
  options?: { ctrlKey?: boolean; metaKey?: boolean },
) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const ctrlMatch = options?.ctrlKey === true ? e.ctrlKey : true
      const metaMatch = options?.metaKey === true ? e.metaKey : true
      if (e.key === key && ctrlMatch && metaMatch) {
        handler(e)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, handler, options])
}
