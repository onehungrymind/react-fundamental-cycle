import type React from 'react'
import type { Task } from '../types'
import type { TaskAction } from '../reducers/taskReducer'
import { TEAM_MEMBERS } from '../data/team'

// TaskAssignment renders a <select> dropdown populated from TEAM_MEMBERS.
//
// Selecting a team member dispatches ASSIGN_TASK.
// Selecting the empty "Unassigned" option dispatches UNASSIGN_TASK.
//
// The component is intentionally small — it owns no local state.
// All state lives in the useReducer in TaskList.

interface TaskAssignmentProps {
  task: Task;
  dispatch: React.Dispatch<TaskAction>;
}

export function TaskAssignment({ task, dispatch }: TaskAssignmentProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;

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
