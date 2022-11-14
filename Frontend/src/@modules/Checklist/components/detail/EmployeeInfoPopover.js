const { Fragment, useEffect } = require("react")
import { Button, CardBody } from "reactstrap"
import { Link } from "react-router-dom"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  useFormatMessage,
  useMergedState,
  formatDate,
  getOptionValue
} from "@apps/utility/common"
import { Popover } from "antd"

const EmployeeInfoPopover = (props) => {
  const {
    employee,
    checklist,
    checklistType,
    showInfoAssigned,
    options,
    handleAssignChecklist
  } = props

  const isOnboardingChecklist =
    parseInt(checklistType) === getOptionValue(options, "type", "onboarding")
  const employeeDate = isOnboardingChecklist ? "join_date" : "last_working_date"

  const _displayEmployeeProperty = (property, type = "object") => {
    if (type === "object") {
      return property !== null ? property.label : "Unknown"
    }

    return property !== null && property !== "Invalid date"
      ? property
      : "Unknown"
  }

  // ** render
  const renderEmployeeAvatar = () => {
    return (
      <CardBody>
        <Link
          className="d-flex justify-content-left align-items-center text-dark"
          tag="div"
          to={`/employees/u/${employee?.username}`}>
          <Avatar className="my-0 me-50" size="sm" src={employee?.avatar} />
          <div className="d-flex flex-column">
            <p className="user-name text-truncate mb-0">
              <span className="fw-bold">{employee?.full_name}</span>{" "}
            </p>
          </div>
        </Link>
      </CardBody>
    )
  }
  const renderAssignButton = () => {
    return (
      <CardBody className="text-center">
        <Button.Ripple
          color="primary"
          outline
          onClick={() => handleAssignChecklist()}>
          {useFormatMessage("modules.checklist.buttons.assign_checklist")}
        </Button.Ripple>
      </CardBody>
    )
  }

  const renderHrInCharge = () => {
    return (
      <tr>
        <td>HR in-charge</td>
        <td>{showInfoAssigned && checklist.hr_in_charge?.full_name}</td>
      </tr>
    )
  }

  const renderAssignTemplate = () => {
    return (
      <tr>
        <td>Template</td>
        <td>{showInfoAssigned && useFormatMessage(checklist.type.label)}</td>
      </tr>
    )
  }

  const renderContent = () => {
    if (employee === undefined) {
      return ""
    }
    return (
      <Fragment>
        {!showInfoAssigned && renderEmployeeAvatar()}
        <CardBody className="pd-0">
          <table>
            <tbody>
              <tr>
                <td>
                  {isOnboardingChecklist
                    ? useFormatMessage("modules.employees.fields.join_date")
                    : useFormatMessage(
                        "modules.employees.fields.last_working_date"
                      )}
                </td>
                <td>
                  {_displayEmployeeProperty(
                    formatDate(
                      employee[employeeDate] === undefined
                        ? ""
                        : employee[employeeDate]
                    ),
                    "date"
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  {useFormatMessage("modules.employees.fields.job_title_id")}
                </td>
                <td>{_displayEmployeeProperty(employee?.job_title_id)}</td>
              </tr>
              <tr>
                <td>
                  {useFormatMessage("modules.employees.fields.department_id")}
                </td>
                <td>{_displayEmployeeProperty(employee?.department_id)}</td>
              </tr>
              {showInfoAssigned && renderHrInCharge()}
              <tr>
                <td>{useFormatMessage("modules.employees.fields.office")}</td>
                <td>{_displayEmployeeProperty(employee?.office)}</td>
              </tr>
              {showInfoAssigned && renderAssignTemplate()}
            </tbody>
          </table>
        </CardBody>
        {!showInfoAssigned && renderAssignButton()}
      </Fragment>
    )
  }

  return (
    <Popover
      content={renderContent()}
      trigger="click"
      key={employee !== undefined ? employee.id : 'sdf'}
      placement="bottom"
      overlayClassName="employee-info-popover">
      {props.children}
    </Popover>
  )
}

export default EmployeeInfoPopover
