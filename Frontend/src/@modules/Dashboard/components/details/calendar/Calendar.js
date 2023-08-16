// ** React Imports
import { Fragment, useEffect, useRef } from "react"
import { calendarApi } from "../../../../../@apps/modules/calendar/common/api"
import moment from "moment"
// ** Styles
// ** Components
import notification from "@apps/utility/notification"
import FullCalendar from "@fullcalendar/react"
import listPlugin from "@fullcalendar/list"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import CalendarDescription from "./CalendarDescription"
import AddCalendarButton from "./AddCalendarButton"
import GroupAllDayEvent from "@modules/Calendar/components/calendar/GroupAllDayEvent"

const Calendar = (props) => {
  const {
    // ** props
    listCalendar,
    showCalendarDescription,
    changeYearType,
    calendarYear,
    filters,
    // ** methods
    handleShowAddEventModal,
    setCalendarYear,
    setFilter
  } = props

  const currentHour = moment().hour()
  const calendarRef = useRef()

  const handleClickCalendar = (id) => {
    calendarApi
      .getEventDetail(item.id)
      .then((res) => {
        const calendarInfo = res.data.data

        handleShowAddEventModal({
          calendarInfo: calendarInfo,
          viewOnly: !calendarInfo.is_editable
        })
      })
      .catch((err) => {
        notification.showError()
      })
  }

  const handleChangeNavigateCalendar = () => {
    const calendarApi = calendarRef.current.getApi()
    const date = moment(calendarApi.getDate())
    const year = date.year()
    if (parseInt(year) !== parseInt(calendarYear)) {
      setCalendarYear(year)
    }
  }

  // ** effect
  useEffect(() => {
    if (changeYearType !== "") {
      const calendarApi = calendarRef.current.getApi()
      if (changeYearType === "increase") {
        calendarApi.nextYear()
      } else {
        calendarApi.prevYear()
      }
    }
  }, [calendarYear])

  // ** render
  const calendarOptions = {
    ref: calendarRef,
    events: listCalendar,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "timeGridWeek",
    dayHeaderFormat: {
      weekday: "narrow"
    },
    firstDay: 1,
    hiddenDays: [0],
    height: 420,
    dayMaxEvents: 3,
    allDaySlot: true,
    customButtons: {
      customPrev: {
        text: <span className="fc-icon fc-icon-chevron-left"></span>,
        click: function () {
          const calendarApi = calendarRef.current.getApi()
          calendarApi.prev()
          handleChangeNavigateCalendar()
        }
      },
      customNext: {
        text: <span className="fc-icon fc-icon-chevron-right"></span>,
        click: function () {
          const calendarApi = calendarRef.current.getApi()
          calendarApi.next()
          handleChangeNavigateCalendar()
        }
      }
    },
    headerToolbar: {
      start: "header",
      center: "customPrev,title,customNext",
      end: "external"
    },
    scrollTime: currentHour - 2 + ":00:00",
    slotMaxTime: currentHour + 3 + ":00:00",
    slotLabelFormat: {
      hour: "2-digit",
      minute: "2-digit",
      omitZeroMinute: false,
      meridiem: false,
      hour12: false
    },
    titleFormat: { month: "long", day: "numeric" },
    displayEventTime: false,
    eventClick({ event: clickedEvent }) {
      const isDOB = clickedEvent._def.extendedProps.isDOB
      const isHoliday = clickedEvent._def.extendedProps.isHoliday
      const isTimeOff = clickedEvent._def.extendedProps.isTimeOff
      const isAllDay = clickedEvent._def.extendedProps.isAllDay
      const isChecklist = clickedEvent._def.extendedProps.isChecklist
      if (!isDOB && !isHoliday && !isTimeOff && !isAllDay && !isChecklist) {
        handleClickCalendar(clickedEvent._def.publicId)
      }
    },
    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      return [
        // Background Color
        `bg-light-${calendarEvent._def.extendedProps.calendar} mb-25 fc-event-text-line-${calendarEvent._def.extendedProps.numRow}`
      ]
    },
    eventContent({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle

      const extendedProps = calendarEvent._def.extendedProps
      const isDOB = extendedProps.isDOB
      const isHoliday = extendedProps.isHoliday
      const isTimeOff = extendedProps.isTimeOff
      const isAllDay = extendedProps.isAllDay
      const isChecklist = extendedProps.isChecklist
      if (
        isAllDay === true ||
        isDOB === true ||
        isHoliday === true ||
        isTimeOff === true ||
        isChecklist === true
      ) {
        return (
          <GroupAllDayEvent
            viewInfoOnly={false}
            date={calendarEvent.startStr}
            extendedProps={extendedProps}
            handleShowAddEventModal={handleShowAddEventModal}
          />
        )
      }
    }
  }

  const renderCalendarDescription = () => {
    if (showCalendarDescription === true) {
      return <CalendarDescription />
    }

    return ""
  }

  return (
    <Fragment>
      <FullCalendar
        {...calendarOptions}
        datesSet={(arg) => {
          if (!moment(arg.end).isSame(filters.to)) {
            setFilter({
              from: moment(arg.start).format("YYYY-MM-DD"),
              to: moment(arg.end).format("YYYY-MM-DD")
            })
          }
        }}
      />
      <AddCalendarButton handleShowAddEventModal={handleShowAddEventModal} />
      <Fragment>{renderCalendarDescription()}</Fragment>
    </Fragment>
  )
}

export default Calendar
