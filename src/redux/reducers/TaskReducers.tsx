import {
  Task,
  ADD_TASK,
  REMOVE_TASK,
  EDIT_TASK,
  TaskActionTypes,
  ItemState,
  LOAD_TASK,
  LOAD_TASK_LOCAL,
} from '../../assets/types';

const initState: ItemState = {
  data: [],
};

export default (state = initState, action: TaskActionTypes): ItemState => {
  switch (action.type) {
    case ADD_TASK:
      return {
        data: [
          ...state.data,
          {
            id: Math.random(),
            title: action.payload.title,
            date: action.payload.date,
            startTime: action.payload.startTime,
            endTime: action.payload.endTime,
            status: action.payload.status,
            priority: action.payload.priority,
          },
        ].sort((a, b) => {
          if (a.priority == b.priority)
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          return a.priority - b.priority;
        }),
      };

    case EDIT_TASK:
      return {
        data: [
          ...state.data.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  title: action.payload.title,
                  date: action.payload.date,
                  startTime: action.payload.startTime,
                  endTime: action.payload.endTime,
                  status: action.payload.status,
                  priority: action.payload.priority,
                }
              : item,
          ),
        ].sort((a, b) => {
          if (a.priority == b.priority)
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          return a.priority - b.priority;
        }),
      };

    case REMOVE_TASK:
      return {
        data: state.data.filter((item) => item.id !== action.payload.id),
      };
    case LOAD_TASK_LOCAL:
      return {...state, data: action.data};
    case LOAD_TASK:
      return {
        ...state,
      };
    default:
      return state;
  }
};
