import { forEach } from "lodash";

const getTaskTypeContent = (arrEmployeeField) => {
  const chosenFieldNumber = arrEmployeeField.length;
  const displayText = chosenFieldNumber > 0 ? arrEmployeeField[0].showText : "";
  const moreOptionNumber =
    chosenFieldNumber >= 2 ? ` (+ ${chosenFieldNumber - 1}) Fields` : "";
  return displayText + moreOptionNumber;
};

const getTaskTypeValue = (options, nameOption) => {
  const taskTypeOption = options.task_type;
  let valueTaskType = 0;
  forEach(taskTypeOption, (item, key) => {
    if (item.name_option === nameOption) {
      valueTaskType = item.value;
      return false;
    }
  });
  return parseInt(valueTaskType);
};

const setTaskTypeContentChosenField = (options, data) => {
  if (
    parseInt(data.task_type.value) ===
    getTaskTypeValue(options, "employeeinformation")
  ) {
    data.task_type_chosen_field = data.task_type_content;
  }
  return data;
};

export {
  getTaskTypeContent,
  getTaskTypeValue,
  setTaskTypeContentChosenField
};
