import type React from 'react'
import type { Task } from '../types'
import { TEAM_MEMBERS } from '../data/team'

interface TaskAssignmentProps {
  task: Task;
  onAssign: (taskId: string, assigneeId: string | undefined) => void;
}

export function TaskAssignment({ task, onAssign }: TaskAssignmentProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const assigneeId = value === '' ? undefined : value;
    onAssign(task.id, assigneeId);
  }

  return (
    <div className="task-assignment">
      <span className="task-assignment__label">Assignee:</span>
      <select
        className="task-assignment__select"
        value={task.assigneeId ?? ''}
        onChange={handleChange}
        aria-label="Assign team member"
      >
        <option value="">Unassigned</option>
        {TEAM_MEMBERS.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TaskAssignment
