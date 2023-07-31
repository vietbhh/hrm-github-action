// ** React Imports
import { useRef } from "react"
// ** Styles
// ** Components
import FullCalendar from "@fullcalendar/react"
import listPlugin from "@fullcalendar/list"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import calendarImg from "@apps/modules/calendar/assets/images/calendar.png"
import { ErpSelect } from "@apps/components/common/ErpField"

const CalendarForIndex = (props) => {
  const {
    // ** props
    listCalendar,
    changeYearType,
    calendarYear,
    // ** methods
    handleShowAddEventModal,
    setCalendarYear
  } = props

  const calendarRef = useRef()

  const calendarOptions = {
    ref: calendarRef,
    events: listCalendar,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "timeGridWeek",
    allDaySlot: true,
    firstDay: 0,
    slotDuration: "00:60:00",
    customButtons: {
      customPrev: {
        text: <span className="fc-icon fc-icon-chevron-left"></span>,
        click: function () {
          const calendarApi = calendarRef.current.getApi()
          calendarApi.prev()
        }
      },
      customNext: {
        text: <span className="fc-icon fc-icon-chevron-right"></span>,
        click: function () {
          const calendarApi = calendarRef.current.getApi()
          calendarApi.next()
        }
      },
      customType: {
        text: <div className="right-action"></div>,
        click: function () {
          return false
        }
      }
    },
    headerToolbar: {
      start: "title,customPrev,today,customNext",
      end: "customType"
    },
    dayHeaderContent: ({ date }, b, c) => {
      const dayOfWeekName = date.toLocaleString("default", { weekday: "short" })
      return (
        <div>
          <span className="day-of-week">{dayOfWeekName}</span>
          <span className="day-number">{date.getDate()}</span>
        </div>
      )
    },
    titleFormat: { month: "long", year: "numeric" },
    editable: true,
    eventDurationEditable: false,
    dragScroll: true,
    navLinks: true,
    dayMaxEvents: 3,
    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const isDOB = calendarEvent._def.extendedProps.isDOB
      if (isDOB !== undefined) {
        return "fc-event-dob"
      }

      const isHoliday = calendarEvent._def.extendedProps.isHoliday
      if (isHoliday !== undefined) {
        return "fc-event-holiday"
      }

      const isTimeOff = calendarEvent._def.extendedProps.isTimeOff
      if (isTimeOff !== undefined) {
        return "fc-event-time-off"
      }
      return [
        // Background Color
        `bg-light-${calendarEvent._def.extendedProps.calendar} mb-25`
      ]
    },
    eventContent({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const extendedProps = calendarEvent._def.extendedProps
      const isAllDay = extendedProps.isAllDay
      if (isAllDay !== undefined) {
        return renderGroupAllDayEvent(extendedProps, calendarEvent.startStr)
      }
    },
    eventClick({ event: clickedEvent }) {
      const isAllDay = clickedEvent._def.extendedProps.isAllDay
      if (!isAllDay) {
        handleClickCalendar(
          clickedEvent._def.publicId,
          clickedEvent._def.extendedProps.isEditable
        )
      }
    },
    dateClick(info) {},
    eventDrop({ event: droppedEvent }) {
      handleDropCalendar(
        droppedEvent._def.publicId,
        droppedEvent.start,
        droppedEvent.end
      )
    },
    direction: "ltr"
  }

  // ** render
  return (
    <div className="pt-2 pb-1 ps-50 pe-0 calendar-for-index">
      <div className="action-right-item">
        <ErpSelect className="change-calendar-type" nolabel={true} options={[
          {"label": "Month", value: "month"},
          {"label": "Week", value: "week"},
          {"label": "Day", value: "day"},
          {"label": "List", value: "list"}
        ]} 
        isClearable={false}/>
      </div>
      <FullCalendar {...calendarOptions} />
    </div>
  )
}

export default CalendarForIndex
