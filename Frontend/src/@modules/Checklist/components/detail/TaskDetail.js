const { Fragment, useEffect, useContext, useState } = require("react");
import { useFormatMessage, useMergedState } from "@apps/utility/common";

const TaskDetail = (props) => {
  const { options } = props;
  const [currentType] = options.task_type.filter((item) => {
    return item.value === props.task_type.value;
  });
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td className="pr-1">{useFormatMessage("modules.checklist_detail.fields.task_type")}: </td>
            <td>
              <span className="fw-bolder">{ useFormatMessage(currentType?.label) }</span>
            </td>
          </tr>
          <tr>
            <td className="pr-1">{useFormatMessage("modules.checklist_detail.fields.task_name")}:</td>
            <td>{props.task_name}</td>
          </tr>
          <tr>
            <td className="pr-1">{useFormatMessage("modules.checklist_detail.fields.assignee")}:</td>
            <td>{useFormatMessage(props.assignee.label)}</td>
          </tr>
          <tr>
            <td className="pr-1">{useFormatMessage("modules.checklist_detail.fields.due_date")}:</td>
            <td>{`${props.due_date_day} ${parseInt(props.due_date_day) === 1 ? 'day' : 'days'} ${useFormatMessage(props.due_date_type.label)} ${useFormatMessage("modules.employees.fields.join_date")}`}</td>
          </tr>
          <tr>
            <td className="pr-1">{useFormatMessage("modules.checklist_detail.fields.description")}:</td>
            <td>{props.description}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TaskDetail;
