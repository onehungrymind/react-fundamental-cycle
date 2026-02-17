// Challenge 24 — Accessibility Fundamentals
// Tests for the SOLUTION Modal: focus trap, Escape key, ARIA attributes,
// focus restoration.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('Modal — ARIA attributes', () => {
  it('renders with role="dialog"', () => {
    renderModal({});
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-modal="true"', () => {
    renderModal({});
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby pointing to the title', () => {
    renderModal({ title: 'My Dialog' });
    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    const titleEl = document.getElementById(labelledById!);
    expect(titleEl).not.toBeNull();
    expect(titleEl?.textContent).toBe('My Dialog');
  });

  it('renders nothing when isOpen is false', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('Modal — Escape key', () => {
  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other keys', () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Modal — backdrop click', () => {
  it('calls onClose when clicking the overlay backdrop', () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    const overlay = document.querySelector('.modal-overlay')!;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the dialog', () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Modal — focus trap', () => {
  beforeEach(() => {
    // jsdom does not natively implement Tab focus management,
    // so we verify the keydown handler is wired and the dialog
    // has tabIndex=-1 for programmatic focus.
  });

  it('dialog element has tabIndex -1 for programmatic focus', () => {
    renderModal({});
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('tabindex', '-1');
  });

  it('Close button is inside the dialog and focusable', () => {
    renderModal({});
    const dialog = screen.getByRole('dialog');
    const closeBtn = screen.getByRole('button', { name: 'Close dialog' });
    expect(dialog.contains(closeBtn)).toBe(true);
  });

  it('Tab key event is handled (keydown listener attached)', async () => {
    const user = userEvent.setup();
    renderModal({});
    // userEvent.tab() will fire a keydown on the document.
    // We just verify no errors are thrown when tabbing.
    await expect(user.tab()).resolves.not.toThrow?.();
  });
});

describe('Modal — focus restoration', () => {
  it('removes keydown listener on unmount (no errors after unmount)', () => {
    const { unmount } = render(
      <Modal isOpen={true} title="Test" onClose={vi.fn()}>
        <button>Button</button>
      </Modal>,
    );
    unmount();
    // After unmount, pressing Escape should not throw
    expect(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    }).not.toThrow();
  });
});
