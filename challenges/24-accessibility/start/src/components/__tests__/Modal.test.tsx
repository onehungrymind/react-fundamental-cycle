// Challenge 24 — Accessibility Fundamentals
//
// START VERSION tests — these expose the accessibility bugs in Modal.

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../Modal'

function renderModal(props: {
  isOpen?: boolean;
  title?: string;
  onClose?: () => void;
}) {
  const onClose = props.onClose ?? vi.fn();
  return {
    onClose,
    ...render(
      <Modal
        isOpen={props.isOpen ?? true}
        title={props.title ?? 'Test Modal'}
        onClose={onClose}
      >
        <button type="button">First Button</button>
        <button type="button">Second Button</button>
      </Modal>,
    ),
  };
}

describe('Modal — renders correctly', () => {
  it('renders title and children when isOpen=true', () => {
    renderModal({ title: 'My Modal' });
    expect(screen.getByText('My Modal')).toBeInTheDocument();
    expect(screen.getByText('First Button')).toBeInTheDocument();
  });

  it('renders nothing when isOpen=false', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText('First Button')).toBeNull();
  });
});

describe('Modal — backdrop click', () => {
  it('calls onClose when clicking the overlay', () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    const overlay = document.querySelector('.modal-overlay')!;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Modal — accessibility BUGs (start version)', () => {
  it('BUG: dialog div does not have role="dialog"', () => {
    renderModal({});
    // The dialog element is missing role="dialog" in the start version.
    // After the fix, this element should be findable with getByRole('dialog').
    const dialog = screen.queryByRole('dialog');
    expect(dialog).toBeNull();
  });

  it('BUG: Escape key does NOT close the modal', () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    // In the buggy version, pressing Escape does nothing.
    expect(onClose).not.toHaveBeenCalled();
  });
});
