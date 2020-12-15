import {
  Task,
  ADD_TASK,
  REMOVE_TASK,
  EDIT_TASK,
  LOAD_TASK,
  LOAD_TASK_LOCAL,
} from '../../assets/types';

const addTask = (task: Task) => {
  return {
    type: ADD_TASK,
    payload: {...task},
  };
};

const removeTask = (id: number) => {
  return {
    type: REMOVE_TASK,
    payload: {id},
  };
};

const editTask = (task: Task) => {
  return {
    type: EDIT_TASK,
    payload: {...task},
  };
};

const getListTaskLocal = (task: Task[]) => {
  return {
    type: LOAD_TASK_LOCAL,
    data: [...task],
  };
};

const loadTask = () => ({
  type: LOAD_TASK,
});
export {addTask, removeTask, editTask, loadTask, getListTaskLocal};
