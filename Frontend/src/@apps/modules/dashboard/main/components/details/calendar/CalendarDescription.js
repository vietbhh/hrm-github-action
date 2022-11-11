// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components

const CalendarDescription = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div className="mt-2 mb-0 d-flex align-items-center">
        <p className="mt-0 mb-0 me-1 fc-event-dob">
          <i className="far fa-gift me-50 label-circle" />
          {useFormatMessage("modules.calendar.title.birthday")}
        </p>
        <p className="mt-0 mb-0 me-1 fc-event-holiday">
          <i className="far fa-calendar-star me-50 label-circle" />
          {useFormatMessage("modules.calendar.title.holiday")}
        </p>
        <p className="mt-0 mb-0 me-1 fc-event-time-off">
          <i className="fad fa-plane-alt me-50 label-circle" />
          {useFormatMessage("modules.calendar.title.time_off")}
        </p>
      </div>
    </Fragment>
  )
}

export default CalendarDescription
