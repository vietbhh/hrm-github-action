// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { calendarApi } from "@apps/modules/calendar/common/api"
import { Fragment, useEffect } from "react"
import moment from "moment"
// ** redux
import {
  showAddEventCalendarModal,
  hideAddEventCalendarModal,
  removeCurrentCalendar
} from "@apps/modules/calendar/common/reducer/calendar"
import { useDispatch } from "react-redux"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import Calendar from "./details/calendar/Calendar"
import AddEventModal from "@apps/modules/calendar/components/modal/AddEventModal"
import LayoutDashboard from "./LayoutDashboard"
import Sidebar from "@apps/modules/calendar/components/sidebar/Sidebar"

const CardCalendar = (props) => {
  const {
    // ** props
    showCalendarDescription
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    loadingCalendar: false,
    listCalendar: [],
    listCalendarTag: [],
    filters: {
      calendarTag: "all"
    },
    calendarYear: moment().year(),
    changeYearType: ""
  })

  const dispatch = useDispatch()

  const setFilter = (filter) => {
    setState({
      filters: {
        ...state.filters,
        ...filter
      }
    })
  }

  const setListCalendar = (data) => {
    setState({
      listCalendar: data
    })
  }

  const setCalendarYear = (year) => {
    setState({
      calendarYear: year
    })
  }

  const setChangeYearType = (type) => {
    setState({
      changeYearType: type
    })
  }

  const handleShowAddEventModal = (data) => {
    dispatch(removeCurrentCalendar())
    dispatch(showAddEventCalendarModal(data))
  }

  const handleHideAddEventModal = () => {
    dispatch(hideAddEventCalendarModal())
  }

  const loadCalendarTag = () => {
    setState({
      loading: true
    })
    calendarApi
      .getCalendarTag()
      .then((res) => {
        const listColor = {}
        res.data.results.map((item) => {
          listColor[item.value] = item.color
        })
        setState({
          listCalendarTag: res.data.results,
          calendarsColor: listColor,
          loading: false
        })
        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
      .catch((err) => {
        setState({
          listCalendarTag: [],
          calendarsColor: {},
          loading: false
        })
        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
  }

  const loadCalendar = () => {
    setState({
      loadingCalendar: true
    })
    calendarApi
      .getCalendar({ calendarTag: [state.filters.calendarTag] })
      .then((res) => {
        const data = res.data.results
        const newCalendar = data.map((item) => {
          const color =
            state.calendarsColor[item.calendar_tag?.label] === undefined
              ? "all-day-event"
              : state.calendarsColor[item.calendar_tag?.label]
          const startTime = moment(item.start)
          const endTime = moment(item.end)
          const duration = moment.duration(endTime.diff(startTime))
          const hours = duration.hours()

          return {
            id: item.id,
            start: item.start,
            end: item.end,
            title: item.title,
            allDay: item.allday,
            editable: false,
            calendar_tag: item.calendar_tag,
            extendedProps: {
              isAllDay: item?.is_all_day,
              listAllDayEvent: item?.is_all_day ? item.list_event : [],
              calendar: color,
              isEditable: item.is_editable,
              numRow: hours > 3 ? 3 : hours
            }
          }
        })
        setState({
          listCalendar: newCalendar,
          loadingCalendar: false
        })
      })
      .catch((err) => {
        setState({
          listCalendar: [],
          loadingCalendar: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadCalendarTag()
  }, [])

  useEffect(() => {
    if (state.loading === false) {
      loadCalendar()
    }
  }, [state.loading, state.filters])

  // ** render
  const renderSidebar = () => {
    return (
      <Sidebar
        listCalendarTag={state.listCalendarTag}
        listCalendar={state.listCalendar}
        calendarYear={state.calendarYear}
        filters={state.filters}
        setFilter={setFilter}
        handleShowAddEventModal={handleShowAddEventModal}
        setListCalendar={setListCalendar}
        setCalendarYear={setCalendarYear}
        setChangeYearType={setChangeYearType}
      />
    )
  }

  const renderCalendar = () => {
    return (
      <Calendar
        listCalendar={state.listCalendar}
        showCalendarDescription={showCalendarDescription}
        changeYearType={state.changeYearType}
        calendarYear={state.calendarYear}
        handleShowAddEventModal={handleShowAddEventModal}
        setCalendarYear={setCalendarYear}
      />
    )
  }

  const renderAddEventModal = () => {
    return (
      <AddEventModal
        handleHideAddEventModal={handleHideAddEventModal}
        loadCalendar={loadCalendar}
      />
    )
  }

  return (
    <LayoutDashboard
      headerProps={{
        id: "upcoming_events",
        title: useFormatMessage("modules.dashboard.upcoming_events"),
        isRemoveWidget: true,
        icon: (
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 1.5V3.75"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 1.5V3.75"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.625 6.8175H15.375"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.75 6.375V12.75C15.75 15 14.625 16.5 12 16.5H6C3.375 16.5 2.25 15 2.25 12.75V6.375C2.25 4.125 3.375 2.625 6 2.625H12C14.625 2.625 15.75 4.125 15.75 6.375Z"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.771 10.275H11.7778"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.771 12.525H11.7778"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.99661 10.275H9.00335"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.99661 12.525H9.00335"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.22073 10.275H6.22747"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.22073 12.525H6.22747"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        classIconBg: "calendar-bg",
        titleLink: "/calendar",
        ...props
      }}>
      <Card className="dashboard-card-calendar calendar">
        <CardBody>
          <div className="d-flex">
            <div className="w-20 pe-1 mt-2">
              <Fragment>{renderSidebar()}</Fragment>
            </div>
            <div className="app-calendar w-80">
              <Fragment>{renderCalendar()}</Fragment>
            </div>
          </div>
        </CardBody>
      </Card>
      {renderAddEventModal()}
    </LayoutDashboard>
  )
}

export default CardCalendar
