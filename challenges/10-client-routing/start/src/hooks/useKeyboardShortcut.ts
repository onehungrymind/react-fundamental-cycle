import { useEffect } from 'react';

// useKeyboardShortcut registers a global keydown listener that fires `callback`
// when the specified key is pressed together with the given modifier key.
//
// Parameters:
//   key      — the KeyboardEvent.key value to match (e.g. 'k')
//   modifier — 'meta' checks e.metaKey (Cmd on macOS); 'ctrl' checks e.ctrlKey
//   callback — function to call when the shortcut fires
//
// The listener is removed automatically when the component unmounts or when
// any of the parameters change (the old listener is removed and a new one
// registered with the updated values).
//
// Usage:
//   useKeyboardShortcut('k', 'meta', () => setShowForm(true));

export function useKeyboardShortcut(
  key: string,
  modifier: 'meta' | 'ctrl',
  callback: () => void,
): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Resolve which modifier property to check based on the `modifier` param.
      const modifierPressed = modifier === 'meta' ? e.metaKey : e.ctrlKey;

      if (modifierPressed && e.key === key) {
        // Prevent browser default action for this shortcut (e.g. address-bar
        // focus for Cmd/Ctrl+K in some browsers).
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup: remove the exact listener function that was attached above.
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, modifier, callback]);
}
