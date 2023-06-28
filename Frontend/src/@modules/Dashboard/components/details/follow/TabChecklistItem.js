// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
// ** Styles
import { Progress } from "antd";
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar";
import EmployeeInfoPopover from "@modules/Checklist/components/detail/EmployeeInfoPopover";

const TabChecklistItem = (props) => {
  const {
    // ** props
    checklist,
    checklistEmployee,
    moduleNameEmployee,
    optionsChecklist
    // ** methods
  } = props;

  // ** render
  return (
    <div className="tab-checklist-item">
      <div className="content-left">
        <div className="me-50">
          <Avatar src={checklistEmployee?.icon} imgHeight={25} imgWidth={25} />
        </div>
        <p className="mb-0 employee-name">
          {checklistEmployee?.username}{" "}
          <EmployeeInfoPopover
            employee={checklistEmployee}
            checklist={checklist}
            showInfoAssigned={true}
            moduleEmployeeName={moduleNameEmployee}
            checklistType={checklist.type?.value}
            options={optionsChecklist}
          >
            <i className="far fa-info-circle" />
          </EmployeeInfoPopover>
        </p>
      </div>
      <div className="content-right">
        {`${checklist.complete_task}/${
          checklist.task_number
        } ${useFormatMessage("modules.checklist.text.completed")}`}{" "}
        <Progress
          type="circle"
          status="exception"
          size={23}
          strokeWidth={17}
          className="mb-25"
          percent={parseInt(
            (checklist.complete_task / checklist.task_number) * 100
          )}
        />
      </div>
    </div>
  );
};

export default TabChecklistItem;
