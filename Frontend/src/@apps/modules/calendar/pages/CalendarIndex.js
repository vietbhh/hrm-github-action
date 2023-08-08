// ** React Imports
// ** Styles
// ** Components
import ModalCreateEvent from "../components/modal/ModalCreateEvent"
import FullCalendarComponent from "./FullCalendarComponent"

const CalendarIndex = (props) => {
  // ** render
  return <FullCalendarComponent modalCreateEvent={ModalCreateEvent} />
}

export default CalendarIndex
