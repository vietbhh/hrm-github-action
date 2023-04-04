import { useFormatMessage } from "@apps/utility/common"
import { Tooltip } from "antd"
import React, { Fragment } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody } from "reactstrap"

const TimelineProfile = (props) => {
  const { employeeData } = props

  return (
    <Fragment>
      <div className="timeline__profile">
        <Card>
          <CardBody>
            <div className="div-info">
              <span className="title">
                {useFormatMessage("modules.timeline.text.introduction")}
              </span>
            </div>
            <Tooltip
              title={useFormatMessage("modules.employees.fields.email")}
              mouseEnterDelay={0.5}
              placement="left">
              <div className="div-info">
                <i className="fa-solid fa-envelope"></i>
                <span className="text">{employeeData?.email || "-"}</span>
              </div>
            </Tooltip>
            <Tooltip
              title={useFormatMessage("modules.employees.fields.dob")}
              mouseEnterDelay={0.5}
              placement="left">
              <div className="div-info">
                <i className="fa-solid fa-cake-candles"></i>
                <span className="text">{employeeData?.dob || "-"}</span>
              </div>
            </Tooltip>
            <Tooltip
              title={useFormatMessage("modules.employees.fields.office")}
              mouseEnterDelay={0.5}
              placement="left">
              <div className="div-info">
                <i className="fa-solid fa-building"></i>
                <span className="text">
                  {employeeData?.office?.label || "-"}
                </span>
              </div>
            </Tooltip>
            <Tooltip
              title={useFormatMessage("modules.employees.fields.job_title_id")}
              mouseEnterDelay={0.5}
              placement="left">
              <div className="div-info">
                <i className="fa-solid fa-briefcase"></i>
                <span className="text">
                  {employeeData?.job_title_id?.label || "-"}
                </span>
              </div>
            </Tooltip>
            <Tooltip
              title={useFormatMessage("modules.employees.fields.department_id")}
              mouseEnterDelay={0.5}
              placement="left">
              <div className="div-info">
                <i className="fa-solid fa-users-line"></i>
                <span className="text">
                  {employeeData?.department_id?.label || "-"}
                </span>
              </div>
            </Tooltip>

            <Link to={`/u/${employeeData.id}/introduction`}>
              <button className="button-introduction">
                <i className="fa-solid fa-pencil me-50"></i>
                {useFormatMessage("modules.timeline.text.edit_information")}
              </button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}

export default TimelineProfile
