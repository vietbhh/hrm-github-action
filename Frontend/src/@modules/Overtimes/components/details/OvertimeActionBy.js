// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import moment from "moment"
// ** Styles
import { Card, CardBody, Badge } from "reactstrap"
import { Collapse } from 'antd'
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const { Panel } = Collapse

const OvertimeActionBy = (props) => {
  const {
    // ** props
    overtime
    // ** methods
  } = props

  const [isExpand, setIsExpand] = useState(false)

  const actionBy = overtime.action_by
  const actionDate = overtime.action_date
  const actionNote = overtime.action_note

  let textColor = ""
  if (overtime.status.name_option === "approved") {
    textColor = "success"
  } else if (overtime.status.name_option === "rejected") {
    textColor = "danger"
  } else if (overtime.status.name_option === "cancelled") {
    textColor = "info"
  }

  // ** render
  const renderComponent = () => {
    return (
      <Card className="w-50 mb-50 border rounded overtime-action-by">
        <CardBody className="mb-25 p-1">
          <div className="d-flex align-items-center mb-1">
            <Avatar imgWidth={30} imgHeight={30} className="me-50" />
            <p className="mb-0">{actionBy?.full_name}</p>
          </div>
          <div>
            <p className="mb-50">
              <b className={`text-${textColor}`}>
                {useFormatMessage(
                  `modules.overtimes.app_options.status.${overtime.status.name_option}`
                )}
              </b>{" "}
              {useFormatMessage("modules.overtimes.text.on")}{" "}
              {moment(actionDate).format("hh:mm A D MMMM YYYY")}
            </p>
            <p className="mb-50">
              {useFormatMessage("modules.overtimes.fields.action_note")}:{" "}
              {actionNote}
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  const renderCollapse = () => {
    return (
      <Fragment>
        <div className="overtime-action-by">
          <div className=" border rounded p-50 action-by-collapse scale">
            <div className="d-flex">
              <Avatar imgWidth={25} imgHeight={25} className="me-50" />
              <p className="mb-0">
                {actionBy?.full_name}{" "}
                <b className={`text-${textColor}`}>
                  {useFormatMessage(
                    `modules.overtimes.app_options.status.${overtime.status.name_option}`
                  )}
                </b>
              </p>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default OvertimeActionBy
