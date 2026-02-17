import type React from 'react'
import type { Task } from '../types'
import { TEAM_MEMBERS } from '../data/team'
import { useUpdateTask } from '../hooks/mutations/useUpdateTask'

interface TaskAssignmentProps {
  task: Task;
  projectId: string;
}

export function TaskAssignment({ task, projectId }: TaskAssignmentProps) {
  const updateTask = useUpdateTask(projectId);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const assigneeId = value === '' ? undefined : value;

    updateTask.mutate({
      taskId: task.id,
      data: { assigneeId },
    });
  }

  return (
    <div className="task-assignment">
      <span className="task-assignment__label">Assignee:</span>
      <select
        className="task-assignment__select"
        value={task.assigneeId ?? ''}
        onChange={handleChange}
        aria-label="Assign team member"
        disabled={updateTask.isPending}
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
