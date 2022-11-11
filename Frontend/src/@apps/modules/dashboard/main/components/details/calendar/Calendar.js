// ** React Imports
import { Fragment, useEffect, useRef } from "react"
import { calendarApi } from "../../../../../calendar/common/api"
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
import GroupAllDayEvent from "@apps/modules/calendar/components/calendar/GroupAllDayEvent"

const Calendar = (props) => {
  const {
    // ** props
    listCalendar,
    showCalendarDescription,
    changeYearType,
    calendarYear,
    // ** methods
    handleShowAddEventModal,
    setCalendarYear
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
  const renderGroupAllDayEvent = (extendedProps, date) => {
    return (
      <GroupAllDayEvent
        viewInfoOnly={false}
        date={date}
        extendedProps={extendedProps}
        handleShowAddEventModal={handleShowAddEventModal}
      />
    )
  }

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
      const isAllDay = clickedEvent._def.extendedProps.isAllDay

      if (!isAllDay) {
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
      const isAllDay = extendedProps.isAllDay

      if (isAllDay !== undefined) {
        return renderGroupAllDayEvent(extendedProps, calendarEvent.startStr)
      }
    }
  }

  const renderCalendarDescription = () => {
    return <CalendarDescription />
  }

  const renderAddCalendarButton = () => {
    return (
      <AddCalendarButton handleShowAddEventModal={handleShowAddEventModal} />
    )
  }

  return (
    <Fragment>
      <FullCalendar {...calendarOptions} />
      <Fragment>{renderAddCalendarButton()}</Fragment>
      <Fragment>
        {showCalendarDescription && renderCalendarDescription()}
      </Fragment>
    </Fragment>
  )
}

export default Calendar
