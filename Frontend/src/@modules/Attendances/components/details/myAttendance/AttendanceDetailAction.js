// ** React Imports
import { getOptionValue, useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Button } from "reactstrap"
import { MoreVertical } from "react-feather"
import { Popover } from "antd"
// ** Components

const AttendanceDetailAction = (props) => {
  const {
    // ** props
    allowEditOvertime,
    attendanceDetail,
    attendanceType,
    chosenEmployee,
    employeeDetail,
    optionsAttendanceDetail,
    // ** methods
    handlePaidTimeModal,
    setCurrentAttendanceDetailData,
    handleOvertimeModal,
    toggleModalAction,
    setStateAction,
    setArrDate
  } = props

  const pendingStatus = getOptionValue(
    optionsAttendanceDetail,
    "status",
    "pending"
  )

  const handleEditPaidTime = () => {
    setCurrentAttendanceDetailData(attendanceDetail)
    handlePaidTimeModal()
  }

  const handleEditOvertime = () => {
    setCurrentAttendanceDetailData(attendanceDetail)
    handleOvertimeModal()
  }

  const handleClickCommon = (
    employeeId,
    actionStatus,
    actionStatusED,
    employeeInfo
  ) => {
    setArrDate(attendanceDetail.date)
    setStateAction({
      action_employee_id: employeeId,
      action_status: actionStatus,
      action_status_ed: actionStatusED,
      action_employee_detail: employeeInfo,
      submit_type: "record"
    })
    toggleModalAction()
  }

  // ** render
  const renderEditPaidTimeButton = () => {
    let disabled = true
    if (attendanceDetail.time_off?.type !== "holiday") {
      if (parseInt(attendanceDetail.status?.value) === pendingStatus) {
        disabled = false
      } else if (attendanceDetail.status === null) {
        disabled = false
      }
    }
    return (
      <Button.Ripple
        color="flat-primary"
        onClick={() => handleEditPaidTime()}
        disabled={disabled}
        className="popover-btn-cancel">
        <i className="far fa-pen table-icon" />
        {useFormatMessage("modules.attendance_logs.buttons.edit_paid_time")}
      </Button.Ripple>
    )
  }

  const renderEditOvertimeButton = () => {
    if (!allowEditOvertime) {
      return ""
    }

    let disabled = true
    if (parseInt(attendanceDetail.status?.value) === pendingStatus) {
      disabled = false
    } else if (attendanceDetail.status === null) {
      disabled = false
    }
    return (
      <Button.Ripple
        color="flat-primary"
        onClick={() => handleEditOvertime()}
        disabled={disabled}
        className="popover-btn-cancel">
        <i className="far fa-pen table-icon" />
        {useFormatMessage("modules.attendance_logs.buttons.edit_overtime")}
      </Button.Ripple>
    )
  }

  const renderRevertButton = () => {
    let disable = true
    if (
      (attendanceDetail.status?.name_option === "approved" ||
        attendanceDetail.status?.name_option === "rejected") &&
      !attendanceDetail.confirm
    ) {
      disable = false
    }
    return (
      <Button.Ripple
        color="flat-warning"
        onClick={() =>
          handleClickCommon(
            chosenEmployee,
            "revert",
            "reverted",
            employeeDetail
          )
        }
        className="popover-btn-cancel"
        disabled={disable}>
        <i className="fal fa-history table-icon" />
        {useFormatMessage("modules.attendance_logs.buttons.revert")}
      </Button.Ripple>
    )
  }

  const renderApproveButton = () => {
    let disable = true
    if (attendanceDetail.status?.name_option === "pending") {
      disable = false
    }
    return (
      <Button.Ripple
        color="flat-primary"
        onClick={() =>
          handleClickCommon(
            chosenEmployee,
            "approve",
            "approved",
            employeeDetail
          )
        }
        className="popover-btn-cancel"
        disabled={disable}>
        <i className="fal fa-check table-icon" />
        {useFormatMessage("modules.attendance_logs.buttons.approve")}
      </Button.Ripple>
    )
  }

  const renderRejectButton = () => {
    let disable = true
    if (attendanceDetail.status?.name_option === "pending") {
      disable = false
    }
    return (
      <Button.Ripple
        color="flat-danger"
        onClick={() =>
          handleClickCommon(
            chosenEmployee,
            "reject",
            "rejected",
            employeeDetail
          )
        }
        className="popover-btn-cancel"
        disabled={disable}>
        <i className="fal fa-times table-icon" />
        {useFormatMessage("modules.attendance_logs.buttons.reject")}
      </Button.Ripple>
    )
  }

  const renderConfirmButton = () => {
    let disable = true
    if (
      (attendanceDetail.status?.name_option === "approved" ||
        attendanceDetail.status?.name_option === "rejected") &&
      !attendanceDetail.confirm
    ) {
      disable = false
    }
    return (
      <Button.Ripple
        color="flat-primary"
        onClick={() =>
          handleClickCommon(
            chosenEmployee,
            "confirm",
            "confirmed",
            employeeDetail
          )
        }
        className="popover-btn-cancel"
        disabled={disable}>
        <i className="fal fa-check table-icon" />
        {useFormatMessage("modules.attendance_logs.buttons.confirm")}
      </Button.Ripple>
    )
  }

  const renderButtonAction = () => {
    if (attendanceType === "my") {
      return (
        <Fragment>
          {renderEditPaidTimeButton()}
          {renderEditOvertimeButton()}
        </Fragment>
      )
    } else if (attendanceType === "employee") {
      return (
        <Fragment>
          {renderRevertButton()}
          {renderApproveButton()}
          {renderEditPaidTimeButton()}
          {renderEditOvertimeButton()}
          {renderConfirmButton()}
          <hr />
          {renderRejectButton()}
        </Fragment>
      )
    } else if (attendanceType === "team") {
      return (
        <Fragment>
          {renderApproveButton()}
          {renderEditPaidTimeButton()}
          {renderEditOvertimeButton()}
          <hr />
          {renderRejectButton()}
        </Fragment>
      )
    }
    return <Fragment></Fragment>
  }

  return (
    <div className="attendance-detail-action">
      <Popover
        placement="bottom"
        title={null}
        content={renderButtonAction()}
        trigger="click"
        overlayClassName="attendance-popover">
        <Button.Ripple size="sm" className="ms-1 btn-icon">
          <MoreVertical size="14" />
        </Button.Ripple>
      </Popover>
    </div>
  )
}

export default AttendanceDetailAction
