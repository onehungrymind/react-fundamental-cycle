// Challenge 24 — Accessibility Fundamentals
//
// START VERSION — has accessibility issues:
//
//   1. No focus trap: Tab key escapes to background elements.
//   2. No Escape key handler to close the modal.
//   3. Missing role="dialog" and aria-modal="true".
//   4. Missing aria-labelledby pointing to the title.
//   5. Focus is not returned to the trigger element on close.
//
// Your task: fix all of the above in a copy of this file.

import { useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      {/* BUG: Missing role="dialog", aria-modal="true", aria-labelledby.
          Focus is not trapped inside this div.
          Escape key does nothing.
          Focus is not restored to trigger element on close. */}
      <div className="modal-dialog">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
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
