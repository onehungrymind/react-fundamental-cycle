import type { Task, TaskStatus } from '../types'

// ============================================================
// State machine — valid status transitions
//
// Exported so UI components can read it to derive which buttons to show,
// keeping the transition rules defined in exactly one place.
// ============================================================

export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo:       ['InProgress'],
  InProgress: ['InReview'],
  InReview:   ['Done', 'InProgress'],
  Done:       [],
}

// ============================================================
// Discriminated union of all task actions
//
// The `type` field is the discriminant: TypeScript narrows the payload type
// inside each `case` of the switch statement.
//
// Rule: no side effects in payloads — callers must generate IDs and
// timestamps *before* dispatching and pass them in the payload.
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
//
// Contract:
//   - Never mutate `state` — always return a new array / new task objects
//   - Never call Date.now(), Math.random(), or crypto.randomUUID() here
//   - Invalid status transitions silently return the existing state unchanged
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
