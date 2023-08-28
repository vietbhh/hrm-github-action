// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { calendarNodeApi } from "../../../@apps/modules/calendar/common/api"
import { getArrWeekDate } from "../../../@apps/modules/calendar/common/common"
import moment from "moment"
import dayjs from "dayjs"
import { feedApi } from "../../Feed/common/api"
// ** redux
import { useSelector } from "react-redux"
// ** Styles
import "../assets/scss/calendarHRM.scss"
// ** Components
import FullCalendarComponent from "../../../@apps/modules/calendar/pages/FullCalendarComponent"
import ModalCreateEvent from "../../../components/hrm/CreatePost/CreatePostDetails/modals/ModalCreateEvent"
import DetailEventModal from "../components/modal/EventDetails/EventDetailsModal"
import GroupAllDayEvent from "../components/calendar/GroupAllDayEvent"
import ListEventHRM from "../components/calendar/ListEventHRM"

const CalendarIndexHRM = () => {
  const [state, setState] = useMergedState({
    loading: true,
    listCalendar: [],
    filterCalendar: {
      from: getArrWeekDate().shift(),
      to: getArrWeekDate().pop()
    },
    dataEventCreated: {},
    options_employee_department: [],
    optionsMeetingRoom: []
  })

  const calendarState = useSelector((state) => state.calendar)
  const { modal } = calendarState
  const dataEmployee = useSelector((state) => state.users.list)

  const setFilterCalendar = (obj) => {
    setState({
      filterCalendar: {
        ...state.filterCalendar,
        ...obj
      }
    })
  }

  const setDataEventCreated = (obj) => {
    setState({
      dataEventCreated: obj
    })
  }

  const loadCalendar = () => {
    setState({
      loading: true
    })

    const params = {
      created_at_from: moment(state.filterCalendar.from).format("YYYY-MM-DD"),
      created_at_to: moment(state.filterCalendar.to).format("YYYY-MM-DD")
    }

    calendarNodeApi
      .getCalendar(params)
      .then((res) => {
        const data = res.data.results
        const newCalendar = data.map((item) => {
          const color = item.color === null ? "all-day-event" : item.color
          const editable = item["is_dob"] === undefined
          return {
            title: item.name,
            id: item._id,
            start: item.start
              ? item.start
              : dayjs(item.start_time_date).format("YYYY-MM-DD") +
                " " +
                dayjs(item.start_time_time).format("HH:mm:ss"),
            end: item.end
              ? item.end
              : dayjs(item.end_time_date).format("YYYY-MM-DD") +
                " " +
                dayjs(item.end_time_time).format("HH:mm:ss"),
            allDay: item.allday,
            editable: editable,
            calendar_tag: item?.calendar_tag,
            extendedProps: {
              isDOB: item?.is_dob,
              isHoliday: item?.is_holiday,
              isTimeOff: item?.is_time_off,
              isAllDay: item?.all_day_event,
              listEmployeeDob: item?.is_dob ? item.employee_info : [],
              listHoliday: item?.is_holiday ? item.holiday_info : [],
              listTimeOff: item?.is_time_off ? item.time_off_info : [],
              listAllDayEvent: item?.all_day_event ? item.list_event : [],
              calendar: color,
              isEditable: item.is_editable
            }
          }
        })

        setState({
          listCalendar: newCalendar,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          listCalendar: [],
          loading: false
        })
      })
  }

  const handleAfterCreateEvent = (dataNew = {}) => {
    setDataEventCreated(dataNew)
    loadCalendar()
  }

  const handleAfterRemoveEvent = () => {
    loadCalendar()
  }

  // ** effect
  useEffect(() => {
    loadCalendar()
  }, [state.filterCalendar])

  useEffect(() => {
    if (modal === true) {
      const data_options = []
      _.forEach(dataEmployee, (item) => {
        data_options.push({
          value: `${item.id}_employee`,
          label: item.full_name,
          tag: item.email,
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
              tag: "department",
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
    <Fragment>
      <FullCalendarComponent
        loading={state.loading}
        listCalendar={state.listCalendar}
        filterCalendar={state.filterCalendar}
        dataEventCreated={state.dataEventCreated}
        modalCreateEvent={ModalCreateEvent}
        loadCalendar={loadCalendar}
        setFilterCalendar={setFilterCalendar}
        setDataEventCreated={setDataEventCreated}
        groupAllDayEvent={GroupAllDayEvent}
        listEvent={ListEventHRM}
      />
      <DetailEventModal
        afterRemove={handleAfterRemoveEvent}
      />
      <ModalCreateEvent
        setDataCreateNew={undefined}
        createEventApi={calendarNodeApi.addCalendar}
        options_employee_department={state.options_employee_department}
        optionsMeetingRoom={state.optionsMeetingRoom}
        getDetailApi={calendarNodeApi.getDetailEvent}
        afterCreate={handleAfterCreateEvent}
      />
    </Fragment>
  )
}

export default CalendarIndexHRM
