// ** React Imports
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { calendarApi } from "../../common/api"
import { useRef, useEffect, Fragment } from "react"
import moment from "moment"
// ** Styles
import { CardBody, Card } from "reactstrap"
// ** Components
import FullCalendar from "@fullcalendar/react"
import listPlugin from "@fullcalendar/list"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import notification from "@apps/utility/notification"
import calendarImg from "@apps/modules/calendar/assets/images/calendar.png"
import GroupAllDayEvent from "./GroupAllDayEvent"
import CalendarDescription from "./CalendarDescription"
import AddCalendarButton from "@modules/Dashboard/components/details/calendar/AddCalendarButton"

const Calendar = (props) => {
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

  const handleClickCalendar = (id, editable) => {
    defaultModuleApi
      .getDetail("calendars", id)
      .then((res) => {
        const calendarInfo = res.data.data
        calendarInfo["is_editable"] = editable
        handleShowAddEventModal({
          calendarInfo: calendarInfo,
          viewOnly: false
        })
      })
      .catch((err) => {
        notification.showError()
      })
  }

  const handleDropCalendar = (id, start, end) => {
    const values = {
      start: moment(start),
      end: end === null ? moment(start) : moment(end)
    }
    calendarApi
      .updateCalendar(id, values)
      .then((res) => {
        notification.showSuccess("notification.update.success")
      })
      .catch((err) => {
        notification.showError("notification.update.error")
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
  }, [calendarYear, changeYearType])

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

  const renderCalendarDescription = () => {
    return <CalendarDescription />
  }

  const calendarOptions = {
    ref: calendarRef,
    events: listCalendar,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    /* customButtons: {
      calendarLogo: {
        text: <img src={calendarImg} alt="" />
      }
    }, */
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
      start: "title, customPrev,customNext",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
    },
    titleFormat: { month: "long" },
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
      const isDOB = extendedProps.isDOB
      const isHoliday = extendedProps.isHoliday
      const isTimeOff = extendedProps.isTimeOff
      const isAllDay = extendedProps.isAllDay
      if (
        isDOB !== undefined ||
        isHoliday !== undefined ||
        isTimeOff !== undefined ||
        isAllDay !== undefined
      ) {
        return renderGroupAllDayEvent(extendedProps, calendarEvent.startStr)
      }
    },
    eventClick({ event: clickedEvent }) {
      const isDOB = clickedEvent._def.extendedProps.isDOB
      const isHoliday = clickedEvent._def.extendedProps.isHoliday
      const isTimeOff = clickedEvent._def.extendedProps.isTimeOff
      const isAllDay = clickedEvent._def.extendedProps.isAllDay
      if (!isDOB && !isHoliday && !isTimeOff && !isAllDay) {
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

  const renderAddCalendarButton = () => {
    return (
      <AddCalendarButton handleShowAddEventModal={handleShowAddEventModal} />
    )
  }

  return (
    <div className="app-calendar calendar-index overflow-hidden">
      <Card className="mb-0">
        <CardBody className="pb-0">
          <FullCalendar {...calendarOptions} />
          <div className="mb-2">{renderCalendarDescription()}</div>
          <Fragment>{renderAddCalendarButton()}</Fragment>
        </CardBody>
      </Card>
    </div>
  )
}

export default Calendar
