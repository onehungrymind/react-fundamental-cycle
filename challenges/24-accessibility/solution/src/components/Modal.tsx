// Challenge 24 — Accessibility Fundamentals
//
// SOLUTION VERSION — all accessibility issues fixed:
//
//   1. Focus trap: Tab and Shift+Tab cycle within the dialog.
//   2. Escape key closes the modal.
//   3. role="dialog" and aria-modal="true" are present.
//   4. aria-labelledby points to the title element.
//   5. Focus is returned to the trigger element on close.

import { useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = 'modal-title';

  // Close when clicking the backdrop (not the dialog box itself)
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  // Prevent scroll on body while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // FIX: Focus trap, Escape key, focus restoration
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (dialog === null) return;

    // Remember where focus was before opening
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move initial focus into the dialog
    dialog.focus();

    function handleKeyDown(e: KeyboardEvent) {
      // FIX: Escape key closes the modal
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // FIX: Trap Tab / Shift+Tab within the dialog
      if (e.key !== 'Tab') return;

      const focusableElements = Array.from(
        dialog!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first || document.activeElement === dialog) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last || document.activeElement === dialog) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // FIX: Restore focus to the element that opened the dialog
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      {/* FIX: role="dialog", aria-modal="true", aria-labelledby, tabIndex for programmatic focus */}
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id={titleId} className="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &#10005;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
