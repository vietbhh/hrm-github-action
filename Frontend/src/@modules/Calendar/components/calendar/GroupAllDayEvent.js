// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import AllDayEvent from "./AllDayEvent"
import HolidayEvent from "./HolidayEvent"
import TimeOffEvent from "./TimeOffEvent"
import EmployeeDOBEvent from "./EmployeeDOBEvent"
import ChecklistEvent from "./ChecklistEvent"

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
  const isDOB = extendedProps.isDOB
  if (isDOB) {
    numberEvent = numberEvent + 1
  }
  const isHoliday = extendedProps.isHoliday
  if (isHoliday) {
    numberEvent = numberEvent + 1
  }
  const isTimeOff = extendedProps.isTimeOff
  if (isTimeOff) {
    numberEvent = numberEvent + 1
  }
  const isAllDay = extendedProps.isAllDay
  if (isAllDay) {
    numberEvent = numberEvent + 1
  }
  const isChecklist = extendedProps.isChecklist
  if (isChecklist) {
    numberEvent = numberEvent + 1
  }

  // ** render
  const renderAllDay = () => {
    if (isAllDay) {
      const listAllDayEvent = extendedProps.listAllDayEvent
      return (
        <AllDayEvent
          viewInfoOnly={viewInfoOnly}
          listAllDayEvent={listAllDayEvent}
          date={date}
          handleShowAddEventModal={handleShowAddEventModal}
        />
      )
    }

    return ""
  }

  const renderHoliday = () => {
    if (isHoliday) {
      const listHoliday = extendedProps.listHoliday
      return <HolidayEvent listHoliday={listHoliday} />
    }

    return ""
  }

  const renderTimeOff = () => {
    if (isTimeOff) {
      const listTimeOff = extendedProps.listTimeOff
      return <TimeOffEvent listTimeOff={listTimeOff} />
    }

    return ""
  }

  const renderDOB = () => {
    if (isDOB) {
      const listEmployeeDob = extendedProps.listEmployeeDob
      return <EmployeeDOBEvent listEmployeeDob={listEmployeeDob} date={date} />
    }

    return ""
  }

  const renderChecklist = () => {
    if (isChecklist) {
      const listChecklist = extendedProps.listChecklist
      return <ChecklistEvent listChecklist={listChecklist} date={date} />
    }

    return ""
  }

  return (
    <div
      className={`d-flex align-items-center all-day-event ${
        numberEvent > 2 ? "all-day-event-collapse" : ""
      }`}>
      <Fragment>{renderAllDay()}</Fragment>
      <Fragment>{renderHoliday()}</Fragment>
      <Fragment>{renderTimeOff()}</Fragment>
      <Fragment>{renderDOB()}</Fragment>
      <Fragment>{renderChecklist()}</Fragment>
    </div>
  )
}

export default GroupAllDayEvent
