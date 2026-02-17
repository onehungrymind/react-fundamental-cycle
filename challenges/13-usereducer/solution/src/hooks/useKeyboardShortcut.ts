import { useEffect } from 'react';

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
