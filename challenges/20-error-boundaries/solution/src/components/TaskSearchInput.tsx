// Challenge 19 — Performance
//
// TaskSearchInput is a focused, single-responsibility component for the
// search text input in the task list.
//
// State colocation principle:
//   The search query state could live in TaskList (the parent), but it
//   could also be passed down as a controlled input — or even encapsulated
//   here with an onChange callback lifted up.
//
//   In this solution the state lives in TaskList (the parent that needs it
//   to filter), and TaskSearchInput receives `value` + `onChange` as props.
//   This keeps the component stateless and pure — it only renders when its
//   props change, which aligns well with React.memo if you ever add it.
//
// Why a separate component?
//   Extracting the search input into its own file makes the intent clear,
//   enables isolated testing, and keeps TaskList focused on data + layout.

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
