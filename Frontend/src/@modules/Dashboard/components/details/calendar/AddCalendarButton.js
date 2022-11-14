// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components

const AddCalendarButton = (props) => {
  const {
    // ** props
    // ** methods
    handleShowAddEventModal
  } = props

  const handleAddEvent = () => {
    handleShowAddEventModal({
        calendarInfo: {},
        viewOnly: false
      })
  }

  // ** render
  return (
    <Fragment>
      <div className="add-calendar" onClick={() => handleAddEvent()}>
        <i className="fas fa-plus" />
      </div>
    </Fragment>
  )
}

export default AddCalendarButton
