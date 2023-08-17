// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { calendarNodeApi } from "@apps/modules/calendar/common/api"
import { Fragment, useEffect } from "react"
import moment from "moment"
import dayjs from "dayjs"
import { getArrWeekDate } from "../../../@apps/modules/calendar/common/common"
import { feedApi } from "../../Feed/common/api"
// ** redux
import {
  showAddEventCalendarModal,
  hideAddEventCalendarModal,
  removeCurrentCalendar
} from "@apps/modules/calendar/common/reducer/calendar"
import { useDispatch, useSelector } from "react-redux"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import Calendar from "./details/calendar/Calendar"
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"
import Sidebar from "@apps/modules/calendar/components/sidebar/Sidebar"
import ModalCreateEvent from "../../../components/hrm/CreatePost/CreatePostDetails/modals/ModalCreateEvent"

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
      color: "",
      from: getArrWeekDate().shift(),
      to: getArrWeekDate().pop()
    },
    calendarYear: moment().year(),
    changeYearType: "",
    options_employee_department: [],
    optionsMeetingRoom: []
  })

  const calendarState = useSelector((state) => state.calendar)
  const { modal } = calendarState
  const dataEmployee = useSelector((state) => state.users.list)

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
    dispatch(
      showAddEventCalendarModal({
        idEvent: null,
        viewOnly: false
      })
    )
  }

  const handleHideAddEventModal = () => {
    dispatch(hideAddEventCalendarModal())
  }
  const loadCalendar = () => {
    setState({
      loadingCalendar: true
    })
    const params = {
      color: state.filters.color,
      created_at_from: moment(state.filters.from).format("YYYY-MM-DD"),
      created_at_to: moment(state.filters.to).format("YYYY-MM-DD")
    }
    calendarNodeApi
      .getCalendar(params)
      .then((res) => {
        const data = res.data.results
        const newCalendar = data.map((item) => {
          const color = item.color === null ? "all-day-event" : item.color
          const startTime = item.start
            ? item.start
            : dayjs(item.start_time_date).format("YYYY-MM-DD") +
              " " +
              dayjs(item.start_time_time).format("HH:mm:ss")
          const endTime = item.end
            ? item.end
            : dayjs(item.end_time_date).format("YYYY-MM-DD") +
              " " +
              dayjs(item.end_time_time).format("HH:mm:ss")
          const duration = moment.duration(dayjs(endTime).diff(startTime))
          const hours = duration.hours()
          return {
            id: item._id,
            start: startTime,
            end: endTime,
            title: item.name,
            allDay: item.allday,
            editable: false,
            calendar_tag: item.calendar_tag,
            extendedProps: {
              isDOB: item?.is_dob,
              isAllDay: item?.all_day_event,
              isHoliday: item?.is_holiday,
              isTimeOff: item?.is_time_off,
              isChecklist: item?.is_checklist,
              listHoliday: item?.is_holiday ? item.holiday_info : [],
              listEmployeeDob: item?.is_dob ? item.employee_info : [],
              listTimeOff: item?.is_time_off ? item.time_off_info : [],
              listAllDayEvent: item?.is_all_day ? item.list_event : [],
              listChecklist: item?.is_checklist ? item.list_checklist : [],
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

  const handleAfterCreateEvent = (dataNew = {}) => {
    loadCalendar()
  }

  // ** effect
  useEffect(() => {
    if (state.loading === false) {
      loadCalendar()
    }
  }, [state.loading, state.filters])

  useEffect(() => {
    if (modal === true) {
      const data_options = []
      _.forEach(dataEmployee, (item) => {
        data_options.push({
          value: `${item.id}_employee`,
          label: item.full_name,
          avatar: item.avatar
        })
      })

      feedApi
        .getGetInitialEvent()
        .then((res) => {
          _.forEach(res.data.dataDepartment, (item) => {
            data_options.push({
              value: `${item.id}_department`,
              label: item.name,
              avatar: ""
            })
          })

          setState({
            options_employee_department: data_options,
            optionsMeetingRoom: res.data.dataMeetingRoom
          })
        })
        .catch((err) => {
          setState({
            options_employee_department: data_options,
            optionsMeetingRoom: []
          })
        })
    }
  }, [modal])

  // ** render
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
            </div>
            <div className="app-calendar w-80">
              <Calendar
                listCalendar={state.listCalendar}
                showCalendarDescription={showCalendarDescription}
                changeYearType={state.changeYearType}
                calendarYear={state.calendarYear}
                filters={state.filters}
                handleShowAddEventModal={handleShowAddEventModal}
                setCalendarYear={setCalendarYear}
                setFilter={setFilter}
              />
            </div>
          </div>
        </CardBody>
      </Card>
      <ModalCreateEvent
        setDataCreateNew={undefined}
        options_employee_department={state.options_employee_department}
        optionsMeetingRoom={state.optionsMeetingRoom}
        createEventApi={calendarNodeApi.addCalendar}
        getDetailApi={calendarNodeApi.getDetailEvent}
        afterCreate={handleAfterCreateEvent}
      />
    </LayoutDashboard>
  )
}

export default CardCalendar
