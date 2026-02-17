import { useEffect } from 'react';

// useKeyboardShortcut registers a global keydown listener that fires `callback`
// when the specified key is pressed together with the given modifier key.
//
// Parameters:
//   key      — the KeyboardEvent.key value to match (e.g. 'k')
//   modifier — 'meta' checks e.metaKey (Cmd on macOS); 'ctrl' checks e.ctrlKey
//   callback — function to call when the shortcut fires
//
// Usage:
//   useKeyboardShortcut('k', 'meta', () => navigate('/projects/new'));

export function useKeyboardShortcut(
  key: string,
  modifier: 'meta' | 'ctrl',
  callback: () => void,
): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const modifierPressed = modifier === 'meta' ? e.metaKey : e.ctrlKey;

      if (modifierPressed && e.key === key) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, modifier, callback]);
}
