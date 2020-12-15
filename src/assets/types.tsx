export const ADD_TASK = 'ADD_TASK';
export const REMOVE_TASK = 'REMOVE_TASK';
export const EDIT_TASK = 'EDIT_TASK';
export const LOAD_TASK = 'LOAD_TASK';
export const LOAD_TASK_LOCAL = 'LOAD_TASK_LOCAL';

export interface ItemState {
  readonly data: Task[];
}

export interface TaskActionTypes {
  type: string;
  payload: Task;
  data: Task[];
}

export interface Task {
  id: number;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: number;
  priority: number;
}
