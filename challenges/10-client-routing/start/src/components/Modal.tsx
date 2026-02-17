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
  if (!isOpen) {
    return null;
  }

  const content = (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        role="dialog"
        aria-modal={true}
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
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

  return ReactDOM.createPortal(content, document.body);
}

export default Modal
