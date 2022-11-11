// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Popover } from "antd"
// ** Components
import AllDayEvent from "./AllDayEvent"

const GroupAllDayEvent = (props) => {
  const {
    // ** props
    viewInfoOnly,
    date,
    extendedProps,
    // ** methods
    handleShowAddEventModal
  } = props

  let numberEvent = 0
 
  const isAllDay = extendedProps.isAllDay
  if (isAllDay) {
    numberEvent = numberEvent + 1
  }

  // ** render
  const renderAllDay = () => {
    if (isAllDay) {
      const listAllDayEvent = extendedProps.listAllDayEvent
      return (
        <Fragment>
          <AllDayEvent
            viewInfoOnly={viewInfoOnly}
            listAllDayEvent={listAllDayEvent}
            date={date}
            handleShowAddEventModal={handleShowAddEventModal}
          />
        </Fragment>
      )
    }

    return ""
  }

  const renderComponent = () => {
    return (
      <Fragment>
        <div
          className={`d-flex align-items-center all-day-event ${
            numberEvent > 2 ? "all-day-event-collapse" : ""
          }`}>
          <Fragment>{renderAllDay()}</Fragment>
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default GroupAllDayEvent
