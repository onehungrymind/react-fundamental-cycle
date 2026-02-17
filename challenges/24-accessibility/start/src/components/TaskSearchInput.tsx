interface TaskSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaskSearchInput({ value, onChange }: TaskSearchInputProps) {
  return (
    <input
      type="search"
      className="task-search-input"
      placeholder="Search tasks..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search tasks"
    />
  )
}

export default TaskSearchInput
