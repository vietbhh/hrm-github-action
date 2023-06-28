import { useFormatMessage } from "@apps/utility/common";
import { Space } from "antd";
import { Fragment, useState } from "react";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import AssignChecklistModal from "../modals/AssignChecklistModal";
import EmployeeInfoPopover from "./EmployeeInfoPopover";

const EmployeeTag = (props) => {
  const {
    data,
    options,
    optionsModules,
    metas,
    loadData,
    module,
    moduleName,
    checklistType,
    moduleEmployeeName
  } = props;

  const [openModal, setOpenModal] = useState(false);
  const [chosenEmployee, setChosenEmployee] = useState({});
  const [modalTitle] = useState(
    useFormatMessage("modules.checklist.buttons.assign_checklist")
  );

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleAssignChecklist = () => {
    handleOpenModal();
  };

  const handleClickDropdown = (employee) => {
    setChosenEmployee(employee);
  };

  const getTotalWaiting = () => {
    const arrAssigned = data.assignedEmployee;
    const arrWaiting = data.employee.list.filter((employee) => {
      if (!arrAssigned.includes(employee.id)) {
        return employee;
      }
    });
    return arrWaiting.length;
  };

  const renderEmployeeTag = () => {
    const arrAssigned = data.assignedEmployee;
    return data.employee.list.map((employee) => {
      if (!arrAssigned.includes(employee.id)) {
        return (
          <div key={employee.id}>
            <EmployeeInfoPopover
              employee={employee}
              checklistType={checklistType}
              handleAssignChecklist={handleAssignChecklist}
              moduleEmployeeName={moduleEmployeeName}
              options={options}
            >
              <Button.Ripple
                size="sm"
                className="cursor-badge"
                color="primary"
                onClick={() => handleClickDropdown(employee)}
              >
                @ {employee.full_name}
              </Button.Ripple>
            </EmployeeInfoPopover>
          </div>
        );
      }
    });
  };

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <p>
            <span className="title-icon">
              <i className="fas fa-bell-on" />
            </span>
            {useFormatMessage("modules.checklist.text.employee_tag_header", {
              employee_number: getTotalWaiting()
            })}
          </p>
        </CardHeader>
        <CardBody>
          <Space size={[8, 16]} wrap>
            {renderEmployeeTag()}
          </Space>
        </CardBody>
      </Card>
      <AssignChecklistModal
        modal={openModal}
        handleModal={handleOpenModal}
        options={options}
        metas={metas}
        optionsModules={optionsModules}
        loadData={loadData}
        module={module}
        moduleName={moduleName}
        chosenEmployee={chosenEmployee}
        modalTitle={modalTitle}
        checklistTypeProps={checklistType}
      />
    </Fragment>
  );
};

export default EmployeeTag;
