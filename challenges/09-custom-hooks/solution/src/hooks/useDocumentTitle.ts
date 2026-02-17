import { useEffect } from 'react';

// useDocumentTitle syncs document.title with the provided string.
//
// Usage:
//   useDocumentTitle('Projects | TaskFlow');
//
// The effect re-runs whenever `title` changes.  No cleanup is needed because
// setting document.title is a simple assignment — there is nothing to undo.

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
