// Challenge 21 — Unit Testing
//
// Tests for AddTaskForm.
//
// AddTaskForm starts in a closed/collapsed state — only a "+ Add task"
// toggle button is visible.  Clicking it reveals the form.
//
// Validation: if the title has fewer than 2 characters when submitted,
// a validation error appears.  On a valid submission the mutation is
// called (optimistic UI updates immediately in the cache).
//
// Key concepts:
//   - Testing toggled visibility (form hidden until toggle clicked)
//   - Asserting on accessible error messages via role="alert"
//   - userEvent.type() for controlled input interactions
//   - queryBy for asserting absence of elements before toggle

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils'
import { AddTaskForm } from '../AddTaskForm'

describe('AddTaskForm', () => {
  describe('closed state (initial)', () => {
    it('shows only the "+ Add task" toggle button initially', () => {
      renderWithProviders(<AddTaskForm projectId="proj-1" />)

      expect(
        screen.getByRole('button', { name: /\+ add task/i }),
      ).toBeInTheDocument()

      // Form inputs should NOT be visible before toggle
      expect(
        screen.queryByLabelText(/task title/i),
      ).not.toBeInTheDocument()
    })

    it('does not render the title input in closed state', () => {
      renderWithProviders(<AddTaskForm projectId="proj-1" />)

      expect(screen.queryByLabelText(/task title/i)).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /^add$/i }),
      ).not.toBeInTheDocument()
    })
  })

  describe('open state (after toggle click)', () => {
    async function openForm() {
      const user = userEvent.setup()
      renderWithProviders(<AddTaskForm projectId="proj-1" />)
      await user.click(screen.getByRole('button', { name: /\+ add task/i }))
      return user
    }

    it('shows the title input after clicking the toggle', async () => {
      await openForm()

      expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
    })

    it('shows the Add and Cancel buttons after opening', async () => {
      await openForm()

      expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument()
    })

    it('hides the toggle button when the form is open', async () => {
      await openForm()

      expect(
        screen.queryByRole('button', { name: /\+ add task/i }),
      ).not.toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('shows an error when submitting with an empty title', async () => {
      const user = userEvent.setup()
      renderWithProviders(<AddTaskForm projectId="proj-1" />)
      await user.click(screen.getByRole('button', { name: /\+ add task/i }))

      // Submit without typing anything
      await user.click(screen.getByRole('button', { name: /^add$/i }))

      expect(screen.getByRole('alert')).toHaveTextContent(
        /at least 2 characters/i,
      )
    })

    it('shows an error when title has only 1 character', async () => {
      const user = userEvent.setup()
      renderWithProviders(<AddTaskForm projectId="proj-1" />)
      await user.click(screen.getByRole('button', { name: /\+ add task/i }))

      await user.type(screen.getByLabelText(/task title/i), 'X')
      await user.click(screen.getByRole('button', { name: /^add$/i }))

      expect(screen.getByRole('alert')).toHaveTextContent(
        /at least 2 characters/i,
      )
    })

    it('clears the validation error when the user starts typing again', async () => {
      const user = userEvent.setup()
      renderWithProviders(<AddTaskForm projectId="proj-1" />)
      await user.click(screen.getByRole('button', { name: /\+ add task/i }))

      // Trigger error
      await user.click(screen.getByRole('button', { name: /^add$/i }))
      expect(screen.getByRole('alert')).toBeInTheDocument()

      // Start typing — error should clear
      await user.type(screen.getByLabelText(/task title/i), 'A')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('cancel button', () => {
    it('closes the form and shows the toggle button when Cancel is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<AddTaskForm projectId="proj-1" />)
      await user.click(screen.getByRole('button', { name: /\+ add task/i }))

      // Verify form is open
      expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      // Form should close
      expect(screen.queryByLabelText(/task title/i)).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /\+ add task/i }),
      ).toBeInTheDocument()
    })

    it('resets the title field when cancelled', async () => {
      const user = userEvent.setup()
      renderWithProviders(<AddTaskForm projectId="proj-1" />)
      await user.click(screen.getByRole('button', { name: /\+ add task/i }))

      await user.type(screen.getByLabelText(/task title/i), 'Half-typed title')
      await user.click(screen.getByRole('button', { name: /cancel/i }))

      // Re-open — input should be empty
      await user.click(screen.getByRole('button', { name: /\+ add task/i }))
      expect(screen.getByLabelText(/task title/i)).toHaveValue('')
    })
  })

  describe('valid submission', () => {
    it('accepts a title with 2 or more characters without a validation error', async () => {
      const user = userEvent.setup()
      renderWithProviders(<AddTaskForm projectId="proj-1" />)
      await user.click(screen.getByRole('button', { name: /\+ add task/i }))

      await user.type(screen.getByLabelText(/task title/i), 'My new task')

      // No validation error should be present before submit
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()

      // Clicking Add fires the mutation.  Because we have no MSW server
      // in this test, the network request will fail and the form may stay
      // open.  What we assert is that no *validation* error appears.
      await user.click(screen.getByRole('button', { name: /^add$/i }))

      // Only network-level errors would appear here; no "at least 2 chars" alert
      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert')
        const validationError = alerts.find((el) =>
          el.textContent?.includes('at least 2 characters'),
        )
        expect(validationError).toBeUndefined()
      })
    })
  })
})
