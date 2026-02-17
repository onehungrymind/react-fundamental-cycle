import type { ProjectStatus } from '../types'

interface StatusFilterProps {
  activeFilter: ProjectStatus | 'all';
  onFilterChange: (filter: ProjectStatus | 'all') => void;
}

// Each button option: the value passed to onFilterChange and the display label.
const FILTER_OPTIONS: { value: ProjectStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All'       },
  { value: 'active',    label: 'Active'    },
  { value: 'completed', label: 'Completed' },
  { value: 'archived',  label: 'Archived'  },
];

export function StatusFilter({ activeFilter, onFilterChange }: StatusFilterProps) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter projects by status">
      {FILTER_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          // Apply the "active" class when this button's value matches the
          // current filter — this is the only visual distinction between buttons.
          className={`filter-btn${activeFilter === value ? ' active' : ''}`}
          onClick={() => onFilterChange(value)}
          // aria-pressed communicates toggle-button state to screen readers.
          aria-pressed={activeFilter === value}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default StatusFilter
