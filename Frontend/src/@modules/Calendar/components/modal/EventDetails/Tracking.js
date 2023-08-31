// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
// ** Styles
import { Button, Col, Row } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import TrackingDetailsModal from "../TrackingDetails/TrackingDetailsModal"

const Tracking = (props) => {
  const {
    // ** props
    infoEvent
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    trackingModal: false
  })

  const listEmployeeState = useSelector((state) => state.users.list)

  const listEmployee = !_.isArray(infoEvent.employee)
    ? []
    : infoEvent.employee
        .filter((item) => {
          return item.status !== ""
        })
        .map((item) => {
          const infoEmployee =
            listEmployeeState[parseInt(item.id)] === undefined
              ? {}
              : listEmployeeState[item.id]
          return {
            ...item,
            avatar: infoEmployee?.avatar,
            label: infoEmployee?.full_name
          }
        })

  const employeeLength = listEmployee.length

  const toggleTrackingModal = () => {
    setState({
      trackingModal: !state.trackingModal
    })
  }

  const handleClickViewAll = () => {
    toggleTrackingModal()
  }

  // ** render
  const renderTrackingDetailsModal = () => {
    if (state.trackingModal === false) {
      return ""
    }

    return (
      <TrackingDetailsModal
        modal={state.trackingModal}
        infoEvent={infoEvent}
        listEmployee={listEmployee}
        handleModal={toggleTrackingModal}
      />
    )
  }

  const renderListEmployee = () => {
    if (infoEvent.important === true) {
      return (
        <div className="d-flex justify-content-center important-div">
          <p className="important-text">
            {useFormatMessage("modules.feed.create_post.text.important_text")}
          </p>
        </div>
      )
    }

    if (listEmployee.length === 0) {
      return (
        <div className="d-flex justify-content-center important-div">
          <p className="important-text">
            {useFormatMessage(
              "modules.feed.create_post.text.no_employee_reaction_text"
            )}
          </p>
        </div>
      )
    }
    const listEmployeeDisplay =
      employeeLength <= 4 ? listEmployee : listEmployee.slice(0, 4)

    return (
      <Row className="list-employee">
        {listEmployeeDisplay.map((item, index) => {
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
                  <small className={`status-text text-${item.status}`}>
                    {useFormatMessage(`modules.feed.post.event.${item.status}`)}
                  </small>
                </div>
              </div>
            </Col>
          )
        })}
      </Row>
    )
  }

  const renderViewAll = () => {
    if (employeeLength <= 4) {
      return ""
    }

    return (
      <Button.Ripple
        size="sm"
        className="view-all-btn"
        onClick={() => handleClickViewAll()}>
        {useFormatMessage("modules.calendar.text.view_all")}
      </Button.Ripple>
    )
  }

  const renderComponent = () => {
    if (infoEvent.is_owner === false) {
      return ""
    }

    return (
      <Fragment>
        <div className="tracking-section">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-1">
              {useFormatMessage("modules.feed.create_event.text.tracking")}
            </h6>
            <div>
              <Fragment>{renderViewAll()}</Fragment>
            </div>
          </div>
          <div className="body">
            <Fragment>{renderListEmployee()}</Fragment>
          </div>
        </div>
        <Fragment>{renderTrackingDetailsModal()}</Fragment>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default Tracking
