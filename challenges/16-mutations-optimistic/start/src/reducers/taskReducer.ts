import type { Task, TaskStatus } from '../types'

// ============================================================
// State machine — valid status transitions
// ============================================================

export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo:       ['InProgress'],
  InProgress: ['InReview'],
  InReview:   ['Done', 'InProgress'],
  Done:       [],
}

// ============================================================
// Discriminated union of all task actions
// ============================================================

export type TaskAction =
  | {
      type: 'ADD_TASK';
      payload: { task: Task };
    }
  | {
      type: 'UPDATE_STATUS';
      payload: {
        taskId: string;
        newStatus: TaskStatus;
        completedAt: string | undefined;
      };
    }
  | {
      type: 'ASSIGN_TASK';
      payload: { taskId: string; assigneeId: string };
    }
  | {
      type: 'UNASSIGN_TASK';
      payload: { taskId: string };
    }
  | {
      type: 'BULK_UPDATE_STATUS';
      payload: { taskIds: string[]; newStatus: TaskStatus; completedAt: string | undefined };
    }

// ============================================================
// Pure reducer
// ============================================================

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {

    case 'ADD_TASK':
      return [...state, action.payload.task];

    case 'UPDATE_STATUS': {
      const { taskId, newStatus, completedAt } = action.payload;
      return state.map((task) => {
        if (task.id !== taskId) return task;
        const allowed = VALID_TRANSITIONS[task.status];
        if (!allowed.includes(newStatus)) return task;
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'Done' ? completedAt : task.completedAt,
        };
      });
    }

    case 'ASSIGN_TASK': {
      const { taskId, assigneeId } = action.payload;
      return state.map((task) =>
        task.id === taskId ? { ...task, assigneeId } : task,
      );
    }

    case 'UNASSIGN_TASK': {
      const { taskId } = action.payload;
      return state.map((task) => {
        if (task.id !== taskId) return task;
        const { assigneeId: _removed, ...rest } = task;
        return rest;
      });
    }

    case 'BULK_UPDATE_STATUS': {
      const { taskIds, newStatus, completedAt } = action.payload;
      const idSet = new Set(taskIds);
      return state.map((task) => {
        if (!idSet.has(task.id)) return task;
        const allowed = VALID_TRANSITIONS[task.status];
        if (!allowed.includes(newStatus)) return task;
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'Done' ? completedAt : task.completedAt,
        };
      });
    }
  }
}
