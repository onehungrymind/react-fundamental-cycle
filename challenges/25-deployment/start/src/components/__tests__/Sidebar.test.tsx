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

describe('Sidebar — landmark label', () => {
  it('nav element has aria-label="Main navigation"', () => {
    renderSidebar();
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });
});

describe('Sidebar — aria-current', () => {
  it('active NavLink has aria-current="page"', () => {
    renderSidebar('/projects');
    const projectsLink = screen.getByRole('link', { name: /Projects/i });
    expect(projectsLink).toHaveAttribute('aria-current', 'page');
  });

  it('inactive NavLink does not have aria-current', () => {
    renderSidebar('/projects');
    const teamLink = screen.getByRole('link', { name: /Team/i });
    expect(teamLink).not.toHaveAttribute('aria-current');
  });

  it('Team link gets aria-current="page" when on /team', () => {
    renderSidebar('/team');
    const teamLink = screen.getByRole('link', { name: /Team/i });
    expect(teamLink).toHaveAttribute('aria-current', 'page');
  });
});

describe('Sidebar — collapsed mode', () => {
  it('applies collapsed class when isCollapsed=true', () => {
    const { container } = renderSidebar('/projects', true);
    const aside = container.querySelector('aside');
    expect(aside?.className).toContain('app-sidebar--collapsed');
  });

  it('icons have aria-hidden="true"', () => {
    renderSidebar();
    const icons = document.querySelectorAll('.sidebar-nav-link__icon');
    icons.forEach((icon) => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
