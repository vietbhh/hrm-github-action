import axios from 'axios'
import { axiosApi } from "@apps/utility/api";
import { serialize } from "@apps/utility/handleData";
import notification from "@apps/utility/notification";
import { useFormatMessage } from '@apps/utility/common';
// ** Get Tasks
export const getTasks = params => {
  return axiosApi.get('/task/list', { params });
}

// ** Re-order Tasks on drag
export const reOrderTasks = tasks => dispatch => dispatch({ type: 'REORDER_TASKS', tasks })

// ** ADD Task
export const addTask = task => {
  return axiosApi.post('/task/add', serialize(_.cloneDeep(task))).then(res => {
      notification.showSuccess(useFormatMessage("notification.save.success"));
    })
}

// ** Update Tasks
export const updateTask = task => {
  const test = serialize(_.cloneDeep(task));
  return axiosApi.post('/task/add', test)
      .then(res => {
        notification.showSuccess(useFormatMessage("notification.save.success"));
      })
}

// ** Delete Task
export const deleteTask = taskId => {
  return (dispatch, getState) => {
    axiosApi.delete('/task/delete/' + taskId, { taskId })
      .then(res => {
        notification.showSuccess(useFormatMessage("notification.save.success"));
      })
  }
}

// ** Select Task
export const selectTask = task => dispatch => {
  dispatch({ type: 'SELECT_TASK', task })
}

export const getTag = tag => {
  return axiosApi.get('/task/gettag');
}