import type React from 'react'
import type { Task } from '../types'
import type { TaskAction } from '../reducers/taskReducer'
import { TEAM_MEMBERS } from '../data/team'

// TODO (Challenge 16):
//   - Replace dispatch prop with an onAssign callback:
//       onAssign: (assigneeId: string | undefined) => void
//   - Call useUpdateTask mutation inside this component OR receive callback from parent

interface TaskAssignmentProps {
  task: Task;
  dispatch: React.Dispatch<TaskAction>;
}

export function TaskAssignment({ task, dispatch }: TaskAssignmentProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;

    // TODO: Replace with mutation call
    if (value === '') {
      dispatch({ type: 'UNASSIGN_TASK', payload: { taskId: task.id } });
    } else {
      dispatch({
        type: 'ASSIGN_TASK',
        payload: { taskId: task.id, assigneeId: value },
      });
    }
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
