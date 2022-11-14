// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import moment from "moment"
import { getTotalTimeAttendance } from "@modules/Attendances/common/common"
// ** Styles
import { Collapse } from "antd"
import { Badge, Col, Row } from "reactstrap"
// ** Components
import EmployeeOvertimeItem from "./EmployeeOvertimeItem"
import ListEmployeeOvertime from "./ListEmployeeOvertime"
import ActionOvertime from "./ActionOvertime"
import ActionOvertimeRequest from "./ActionOvertimeRequest"
import OvertimeActionBy from "./OvertimeActionBy"

const { Panel } = Collapse

const OvertimeItem = (props) => {
  const {
    // ** props
    fromComponent,
    overtime,
    // ** methods
    toggleModalAction,
    setActionType,
    setIsEditModal,
    setModalData
  } = props

  // ** render
  const renderStatus = () => {
    if (overtime.status.name_option === "pending") {
      return (
        <Badge color="light-warning">
          {useFormatMessage("modules.overtimes.app_options.status.pending")}
        </Badge>
      )
    } else if (overtime.status.name_option === "approved") {
      return (
        <Badge color="light-success">
          {useFormatMessage("modules.overtimes.app_options.status.approved")}
        </Badge>
      )
    } else if (overtime.status.name_option === "rejected") {
      return (
        <Badge color="light-danger">
          {useFormatMessage("modules.overtimes.app_options.status.rejected")}
        </Badge>
      )
    } else if (overtime.status.name_option === "cancelled") {
      return (
        <Badge color="light-info">
          {useFormatMessage("modules.overtimes.app_options.status.cancelled")}
        </Badge>
      )
    }

    return ""
  }

  const renderActionOvertime = () => {
    if (fromComponent === "manage") {
      return (
        <ActionOvertime
          overtime={overtime}
          toggleModalAction={toggleModalAction}
          setActionType={setActionType}
          setModalData={setModalData}
        />
      )
    } else if (fromComponent === "request") {
      return (
        <ActionOvertimeRequest
          overtime={overtime}
          toggleModalAction={toggleModalAction}
          setIsEditModal={setIsEditModal}
          setModalData={setModalData}
        />
      )
    }

    return ""
  }

  const renderPanelHeader = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <p className="mb-0 me-1">
              <i className="far fa-calendar me-50 text-primary pb-25" />
              <span className="overtime-item-title ">
                {overtime.created_by?.label}{" "}
                {useFormatMessage("modules.overtimes.text.requested_on")}{" "}
                {moment(overtime.date).format("D MMMM YYYY")}
              </span>
            </p>
            <Fragment>{renderStatus()}</Fragment>
          </div>
          <div>
            <Fragment>{renderActionOvertime()}</Fragment>
          </div>
        </div>
      </Fragment>
    )
  }

  const renderTimeOvertime = () => {
    const { hours, minutes } = getTotalTimeAttendance(overtime.total_time)
    return (
      <div className="w-50 mt-1">
        <Row className="mb-50">
          <Col sm={4}>
            <p className="mb-0">
              {useFormatMessage("modules.overtimes.text.from")}:
            </p>
          </Col>
          <Col sm={8}>
            <p className="mb-0">
              {moment(overtime.date + " " + overtime.from_time).format(
                "hh:mm A"
              )}
            </p>
          </Col>
        </Row>
        <Row className="mb-50">
          <Col sm={4}>
            <p className="mb-0">
              {useFormatMessage("modules.overtimes.text.to")}:
            </p>
          </Col>
          <Col sm={8}>
            <p className="mb-0">
              {moment(overtime.date + " " + overtime.to_time).format("hh:mm A")}
            </p>
          </Col>
        </Row>
        <Row className="mb-50">
          <Col sm={4}>
            <p className="mb-0">
              {useFormatMessage("modules.overtimes.fields.total_time")}:
            </p>
          </Col>
          <Col sm={8}>
            <p className="mb-0">
              {hours}h {minutes}m{" "}
            </p>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col sm={4}>
            <p className="mb-0">
              {useFormatMessage("modules.overtimes.fields.note")}:
            </p>
          </Col>
          <Col sm={8}>
            <p className="mb-0">{overtime.note}</p>
          </Col>
        </Row>
      </div>
    )
  }

  const renderListEmployee = () => {
    const employees = overtime.employee

    if (_.isEmpty(employees)) {
      return <Fragment></Fragment>
    }

    return (
      <Fragment>
        <ListEmployeeOvertime employees={employees} />
      </Fragment>
    )
  }

  const renderOvertimeActionBy = () => {
    if (
      overtime.status?.name_option !== undefined &&
      overtime.status?.name_option !== "pending"
    ) {
      return <OvertimeActionBy overtime={overtime} />
    }

    return ""
  }

  return (
    <Fragment>
      <Collapse
        expandIcon={(panelProps) => {
          return panelProps.isActive ? (
            <i className="fas fa-angle-down" />
          ) : (
            <i className="fas fa-angle-right" />
          )
        }}
        bordered={false}
        className="mb-2">
        <Panel header={renderPanelHeader()} key="1">
          <div className="pt-2 ps-2 pb-2 pe-0">
            <div className="d-flex justify-content-between">
              <Fragment>{renderTimeOvertime()}</Fragment>
              <Fragment>{renderOvertimeActionBy()}</Fragment>
            </div>
            <Fragment>{renderListEmployee()}</Fragment>
          </div>
        </Panel>
      </Collapse>
    </Fragment>
  )
}

export default OvertimeItem
