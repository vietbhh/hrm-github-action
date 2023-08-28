// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const Tracking = (props) => {
  const {
    // ** props
    infoEvent
    // ** methods
  } = props

  const listAttendees = infoEvent.attendees

  // ** render
  const renderListEmployee = () => {
    if (!_.isArray(listAttendees)) {
      return ""
    }

    if (listAttendees.length === 0) {
      return ""
    }

    const listEmployee = !_.isArray(infoEvent.employee)
      ? []
      : infoEvent.employee
    const employeeLength = listAttendees.length
    const listEmployeeDisplay =
      employeeLength <= 4 ? listAttendees : listAttendees.slice(0, 4)
    const listEmployeeDisplayFilter = listEmployeeDisplay
      .map((item) => {
        const employeeId =
          item.value.search("_employee") > 0
            ? item.value.replace("_employee", "")
            : null

        if (employeeId === null) {
          return undefined
        }

        const [infoEmployee] = listEmployee.filter((itemFilter) => {
          return parseInt(itemFilter.id) === parseInt(employeeId)
        })

        return {
          ...item,
          info_employee: infoEmployee
        }
      })
      .filter((item) => {
        return item !== undefined
      })
      .filter((item, index) => {
        return index < 4
      })

    return (
      <Row className="list-employee">
        {listEmployeeDisplayFilter.map((item, index) => {
          const infoEmployee = item.info_employee
          return (
            <Col
              sm={6}
              className="mb-2 employee-item"
              key={`tracking-item-${index}`}>
              <div className="d-flex align-items-center">
                <div className="me-50">
                  <Avatar src={item.avatar} imgWidth="40" imgHeight="40" />
                </div>
                <div>
                  <p className="mb-0 employee-name">{item.label}</p>
                  <small className={`status-text text-${infoEmployee.status}`}>
                    {useFormatMessage(
                      `modules.feed.post.event.${infoEmployee.status}`
                    )}
                  </small>
                </div>
              </div>
            </Col>
          )
        })}
      </Row>
    )
  }

  const renderComponent = () => {
    if (infoEvent.is_owner === false) {
      return ""
    }

    return (
      <div className="tracking-section">
        <h6 className="mb-1">
          {useFormatMessage("modules.feed.create_event.text.tracking")}
        </h6>
        <div className="body">
          <Fragment>{renderListEmployee()}</Fragment>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default Tracking
