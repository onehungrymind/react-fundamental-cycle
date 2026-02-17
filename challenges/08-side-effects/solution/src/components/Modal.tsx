import ReactDOM from 'react-dom'

// Modal renders a portal-based dialog overlay.
//
// Key design decisions:
//   - createPortal renders into document.body so the overlay sits on top of
//     everything regardless of any ancestor's z-index or overflow: hidden.
//   - The backdrop covers the full viewport; clicking it calls onClose.
//   - The dialog uses e.stopPropagation() so clicks inside it do NOT bubble
//     to the backdrop and accidentally close the modal.
//   - When isOpen is false, nothing is rendered — no DOM node, no portal.

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Guard: render nothing at all when the modal is closed.
  // This keeps the DOM clean and avoids focus/accessibility issues with
  // hidden but mounted dialogs.
  if (!isOpen) {
    return null;
  }

  // The portal content is what gets attached to document.body.
  const content = (
    // Backdrop: full-viewport semi-transparent overlay.
    // Clicking the backdrop (but not the dialog) fires onClose.
    <div
      className="modal-backdrop"
      onClick={onClose}
      // role="dialog" and aria-modal on the inner dialog element; the backdrop
      // itself does not need an ARIA role.
    >
      {/* Dialog: the visible card that contains the title and children.
          e.stopPropagation() prevents the click from bubbling to the backdrop. */}
      <div
        className="modal-dialog"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        role="dialog"
        aria-modal={true}
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          {/* X button in the top-right corner of the modal header. */}
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );

  // ReactDOM.createPortal(content, container) renders content into container
  // rather than into the component's parent DOM node.  Using document.body
  // guarantees the modal is always on top of everything else.
  return ReactDOM.createPortal(content, document.body);
}

export default Modal
