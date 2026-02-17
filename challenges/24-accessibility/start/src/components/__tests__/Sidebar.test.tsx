// Challenge 24 — Accessibility Fundamentals
//
// START VERSION tests — expose the Sidebar accessibility bugs.

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import type { NavItem } from '../../types'

const NAV_ITEMS: NavItem[] = [
  { label: 'Projects', path: '/projects', icon: '□' },
  { label: 'Team',     path: '/team',     icon: '○' },
]

function renderSidebar(initialPath = '/projects', isCollapsed = false) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar navItems={NAV_ITEMS} isCollapsed={isCollapsed} />
    </MemoryRouter>,
  );
}

describe('Sidebar — renders nav items', () => {
  it('renders all nav items as links', () => {
    renderSidebar();
    expect(screen.getByRole('link', { name: /Projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Team/i })).toBeInTheDocument();
  });
});

describe('Sidebar — accessibility BUGs (start version)', () => {
  it('BUG: nav element does NOT have aria-label="Main navigation"', () => {
    renderSidebar();
    // In the buggy version the nav lacks aria-label.
    // getByRole with name should fail to find it.
    const nav = screen.queryByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeNull();
  });
});
