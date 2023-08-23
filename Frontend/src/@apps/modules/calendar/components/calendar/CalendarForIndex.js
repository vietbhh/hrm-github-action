// ** React Imports
import { useEffect, useRef } from "react"
import moment from "moment"
// ** redux
import { useDispatch } from "react-redux"
import { showDetailEventModal, showAddEventCalendarModal } from "../../common/reducer/calendar"
// ** Styles
// ** Components
import "@fullcalendar/react/dist/vdom"
import FullCalendar from "@fullcalendar/react"
import listPlugin from "@fullcalendar/list"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { ErpSelect } from "@apps/components/common/ErpField"

const CalendarForIndex = (props) => {
  const {
    // ** props
    listCalendar,
    filter,
    filterCalendar,
    // ** component
    groupAllDayEvent,
    // ** methods
    setFilterCalendar
  } = props

  const dispatch = useDispatch()

  const options = [
    { label: "Month", value: "dayGridMonth" },
    { label: "Week", value: "timeGridWeek" },
    { label: "Day", value: "timeGridDay" }
  ]

  const calendarRef = useRef()

  const handleChangeView = (value) => {
    calendarRef.current.getApi().changeView(value.value)
  }

  const handleClickCalendar = (calendarId) => {
    dispatch(
      showDetailEventModal({
        idEvent: calendarId,
        viewOnly: false
      })
    )
  }

  const GroupAllDayEvent = groupAllDayEvent

  const calendarOptions = {
    editable: false,
    selectable: false,
    ref: calendarRef,
    events: listCalendar,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "timeGridWeek",
    allDaySlot: true,
    firstDay: 0,
    slotDuration: "00:60:00",
    slotLabelFormat: {
      hour: "numeric",
      minute: "2-digit",
      omitZeroMinute: false,
      meridiem: false,
      hour12: false
    },
    customButtons: {
      customPrev: {
        text: <span className="fc-icon fc-icon-chevron-left"></span>,
        click: function (dateInfo) {
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
    dayHeaderContent: ({ date, view }, b, c) => {
      const dayOfWeekName = date.toLocaleString("default", { weekday: "short" })
      return (
        <div>
          <span className="day-of-week">{dayOfWeekName}</span>
          <span className="day-number">
            {view.type === "dayGridMonth" ? "" : date.getDate()}
          </span>
        </div>
      )
    },
    titleFormat: { month: "long", year: "numeric" },
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
      const isAllDay = extendedProps?.isAllDay
      const isDOB = extendedProps?.isDOB
      const isHoliday = extendedProps?.isHoliday
      const isTimeOff = extendedProps?.isTimeOff
      if (
        isAllDay === true ||
        isDOB === true ||
        isHoliday === true ||
        isTimeOff === true
      ) {
        return (
          <GroupAllDayEvent
            viewInfoOnly={false}
            date={calendarEvent.startStr}
            extendedProps={extendedProps}
            handleShowAddEventModal={handleClickCalendar}
          />
        )
      }
    },
    eventClick({ event: clickedEvent }) {
      const isDOB = clickedEvent._def.extendedProps.isDOB
      const isHoliday = clickedEvent._def.extendedProps.isHoliday
      const isTimeOff = clickedEvent._def.extendedProps.isTimeOff
      const isAllDay = clickedEvent._def.extendedProps.isAllDay
      if (!isDOB && !isHoliday && !isTimeOff && !isAllDay) {
        handleClickCalendar(clickedEvent._def.publicId)
      }
    },
    dateClick(info) {
      handleClickCalendar(null)
    },
    direction: "ltr",
    eventAllow: (dropInfo, draggedEvent) => {
      return false // resourceEditable would be more appropriate but is undefined
    }
  }

  // ** effect
  useEffect(() => {
    calendarRef.current.getApi().gotoDate(filter.from)
  }, [filter])

  // ** render
  return (
    <div className="pt-2 pb-1 ps-50 pe-0 calendar-for-index">
      <div className="action-right-item">
        <ErpSelect
          className="change-calendar-type"
          nolabel={true}
          defaultValue={options[1]}
          options={options}
          isClearable={false}
          onChange={(value) => handleChangeView(value)}
        />
      </div>
      <FullCalendar
        {...calendarOptions}
        datesSet={(arg) => {
          if (!moment(arg.end).isSame(filterCalendar.to)) {
            setFilterCalendar({
              from: moment(arg.start).format("YYYY-MM-DD"),
              to: moment(arg.end).format("YYYY-MM-DD")
            })
          }
        }}
      />
    </div>
  )
}

export default CalendarForIndex