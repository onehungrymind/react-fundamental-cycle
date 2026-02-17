import type { ProjectStatus } from '../types'

interface StatusFilterProps {
  activeFilter: ProjectStatus | 'all';
  onFilterChange: (filter: ProjectStatus | 'all') => void;
}

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
          className={`filter-btn${activeFilter === value ? ' active' : ''}`}
          onClick={() => onFilterChange(value)}
          aria-pressed={activeFilter === value}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default StatusFilter
