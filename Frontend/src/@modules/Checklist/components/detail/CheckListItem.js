import { Fragment } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  NavLink,
  Button
} from "reactstrap";
import { MoreVertical, Edit, Trash, Flag, Copy } from "react-feather";
import { useFormatMessage } from "@apps/utility/common";
import { NavLink as RRNavLink } from "react-router-dom";
import { Popover } from "antd";

const ChecklistItem = (props) => {
  const {
    checklistInfo,
    editChecklist,
    deleteChecklist,
    toggleDuplicateModal,
    setFillDataDuplicateModal
  } = props;

  const pathname = "/checklist/setting/";

  const handleEdit = () => {
    editChecklist({
      id: checklistInfo.id,
      name: checklistInfo.name,
      description: checklistInfo.description,
      type: checklistInfo.type,
      modalTitle: useFormatMessage("modules.checklist_template.buttons.edit")
    });
  };

  const handleDuplicate = () => {
    setFillDataDuplicateModal(checklistInfo);
    toggleDuplicateModal();
  };

  const handleDeleteChecklist = () => {
    deleteChecklist(checklistInfo.id);
  };

  // ** render
  const renderChecklistAction = () => {
    const content = (
      <Fragment>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          onClick={() => handleEdit()}
        >
          <Edit className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.checklist_template.buttons.edit")}
          </span>
        </Button.Ripple>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          onClick={() => handleDuplicate()}
        >
          <Copy className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.checklist_template.buttons.duplicate")}
          </span>
        </Button.Ripple>
        <hr />
        <Button.Ripple
          color="flat-danger"
          size="sm"
          onClick={() => handleDeleteChecklist()}
        >
          <Trash className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.checklist_template.buttons.delete")}
          </span>
        </Button.Ripple>
      </Fragment>
    );
    return (
      <Popover
        placement="bottom"
        content={content}
        trigger="click"
        overlayClassName="popover-checklist-action"
      >
        <MoreVertical size={17} className="cursor-pointer" />
      </Popover>
    );
  };

  return (
    <div className="col-sm-12 col-md-6">
      <Card className="card-checklist-item">
        <CardHeader>
          <div>
            <h4>
              <NavLink
                className="custom-nav-link"
                to={`${pathname}${checklistInfo.type.name_option}/${checklistInfo.id}`}
                tag={RRNavLink}
              >
                <div className="d-flex">
                  <div className="title-icon">
                    <i className="fas fa-tasks" />
                  </div>
                  <div>
                    <span className="checklist-name">{checklistInfo.name}</span>
                  </div>
                </div>
              </NavLink>
            </h4>
          </div>
          <div>{renderChecklistAction()}</div>
        </CardHeader>
        <CardBody>
          <p>
            {checklistInfo.description !== "" ? checklistInfo.description : "-"}
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default ChecklistItem;
