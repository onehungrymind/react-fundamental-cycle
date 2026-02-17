// Tests for Feature 1: TeamMemberSelect — searchable combobox
//
// Covers:
//   - Renders input with combobox role
//   - Shows team members dropdown on focus
//   - Filters members as user types
//   - Selects a member on click
//   - Arrow key navigation changes active option
//   - Enter key selects the active option
//   - Escape key closes dropdown
//   - Shows selected member chip when a member is assigned
//   - Calls onAssign with undefined when unassigning

import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { teamMembers } from '../../mocks/data'
import { renderWithProviders } from '../../test/utils'
import { TeamMemberSelect } from '../TeamMemberSelect'

function renderSelect(props: {
  assigneeId?: string;
  onAssign?: (taskId: string, assigneeId: string | undefined) => void;
}) {
  return renderWithProviders(
    <TeamMemberSelect
      taskId="task-1"
      assigneeId={props.assigneeId}
      onAssign={props.onAssign ?? vi.fn()}
    />,
  )
}

describe('TeamMemberSelect', () => {
  it('renders a combobox input', async () => {
    renderSelect({})
    // Wait for team data to load
    await waitFor(() =>
      expect(screen.getByRole('combobox')).toBeInTheDocument(),
    )
  })

  it('shows all team members in dropdown when focused', async () => {
    const user = userEvent.setup()
    renderSelect({})

    const input = await screen.findByRole('combobox')
    await user.click(input)

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    for (const member of teamMembers) {
      expect(screen.getByText(member.name)).toBeInTheDocument()
    }
  })

  it('filters members by name as user types', async () => {
    const user = userEvent.setup()
    renderSelect({})

    const input = await screen.findByRole('combobox')
    await user.click(input)
    await user.type(input, 'Sarah')

    await waitFor(() => {
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
      expect(screen.queryByText('Marcus Johnson')).not.toBeInTheDocument()
    })
  })

  it('filters members by role', async () => {
    const user = userEvent.setup()
    renderSelect({})

    const input = await screen.findByRole('combobox')
    await user.click(input)
    await user.type(input, 'Designer')

    await waitFor(() => {
      expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument()
      expect(screen.queryByText('Sarah Chen')).not.toBeInTheDocument()
    })
  })

  it('shows "no results" message when filter matches nothing', async () => {
    const user = userEvent.setup()
    renderSelect({})

    const input = await screen.findByRole('combobox')
    await user.click(input)
    await user.type(input, 'zzz-no-match')

    await waitFor(() => {
      expect(screen.getByText(/no members match/i)).toBeInTheDocument()
    })
  })

  it('calls onAssign when a member is clicked', async () => {
    const user = userEvent.setup()
    const onAssign = vi.fn()
    renderSelect({ onAssign })

    const input = await screen.findByRole('combobox')
    await user.click(input)

    await waitFor(() =>
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument(),
    )

    await user.click(screen.getByText('Sarah Chen'))

    expect(onAssign).toHaveBeenCalledWith('task-1', 'tm-1')
  })

  it('navigates options with Arrow Down and selects with Enter', async () => {
    const user = userEvent.setup()
    const onAssign = vi.fn()
    renderSelect({ onAssign })

    const input = await screen.findByRole('combobox')
    await user.click(input)

    await waitFor(() =>
      expect(screen.getByRole('listbox')).toBeInTheDocument(),
    )

    // Move down to first option
    await user.keyboard('{ArrowDown}')
    // Select it
    await user.keyboard('{Enter}')

    expect(onAssign).toHaveBeenCalledWith('task-1', teamMembers[0].id)
  })

  it('closes the dropdown when Escape is pressed', async () => {
    const user = userEvent.setup()
    renderSelect({})

    const input = await screen.findByRole('combobox')
    await user.click(input)

    await waitFor(() =>
      expect(screen.getByRole('listbox')).toBeInTheDocument(),
    )

    await user.keyboard('{Escape}')

    await waitFor(() =>
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument(),
    )
  })

  it('shows selected member chip when assigneeId is set', async () => {
    renderSelect({ assigneeId: 'tm-3' })

    // Should show Emily Rodriguez's name (she's tm-3)
    await waitFor(() => {
      expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument()
    })
    // Combobox input should not be visible when showing chip
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('calls onAssign(undefined) when clear button is clicked', async () => {
    const user = userEvent.setup()
    const onAssign = vi.fn()
    renderSelect({ assigneeId: 'tm-1', onAssign })

    await waitFor(() =>
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument(),
    )

    const clearBtn = screen.getByRole('button', { name: /unassign sarah chen/i })
    await user.click(clearBtn)

    expect(onAssign).toHaveBeenCalledWith('task-1', undefined)
  })

  it('shows loading state while team is being fetched', async () => {
    // Delay the team response so we can see the loading state
    server.use(
      http.get('/api/team', async () => {
        await new Promise((r) => setTimeout(r, 500))
        return HttpResponse.json([])
      }),
    )

    renderSelect({})

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
