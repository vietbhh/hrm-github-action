// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { calendarNodeApi } from "../common/api"
import moment from "moment"
import { getArrWeekDate } from "../common/common"
import dayjs from "dayjs"
// ** Styles
// ** Components=
import SidebarForIndex from "../components/sidebar/SidebarForIndex"
import CalendarForIndex from "../components/calendar/CalendarForIndex"
import SyncGoogleCalendarInfo from "../components/calendar/SyncGoogleCalendarInfo"

const FullCalendarComponent = (props) => {
  const {
    // ** props
    // ** component
    modalCreateEvent
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    loadingCalendar: false,
    listCalendar: [],
    calendarsColor: [],
    currentCalendar: {},
    syncGoogleInfo: {},
    filter: {
      from: moment().format("YYYY-MM-DD")
    },
    filterCalendar: {
      from: getArrWeekDate().shift(),
      to: getArrWeekDate().pop()
    },
    visibleAddEvent: false,
    calendarYear: moment().year(),
    changeYearType: "",
    modal: false,
    dataEventCreated: {}
  })

  const setFilter = (obj) => {
    setState({
      filter: {
        ...state.filter,
        ...obj
      }
    })
  }

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
      loadingCalendar: true
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
          let color = item.color === null ? "all-day-event" : item.color
          if (item["is_dob"] !== undefined) {
            color = "danger"
          }
          const editable = item["is_dob"] === undefined
          return {
            title: item.name,
            id: item._id,
            start:
              dayjs(item.start_time_date).format("YYYY-MM-DD") +
              " " +
              dayjs(item.start_time_time).format("HH:mm:ss"),
            end:
              dayjs(item.end_time_date).format("YYYY-MM-DD") +
              " " +
              dayjs(item.end_time_time).format("HH:mm:ss"),
            allDay: item.all_day_event,
            editable: editable,
            calendar_tag: item?.calendar_tag,
            extendedProps: {
              isAllDay: item?.all_day_event,
              listAllDayEvent: item?.is_all_day ? item.list_event : [],
              calendar: color,
              isEditable: item.is_editable
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

  const toggleModal = (status = "") => {
    setState({
      modal: status === "" ? !state.modal : status
    })
  }

  const handleAfterCreateEvent = (dataNew = {}) => {
    setDataEventCreated(dataNew)
    loadCalendar()
  }

  // ** effect
  useEffect(() => {
    loadCalendar()
  }, [state.filterCalendar])

  useEffect(() => {
    if (state.visibleAddEvent === true) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [state.visibleAddEvent])

  useEffect(() => {
    if (Object.keys(state.dataEventCreated).length > 0) {
      setFilter({
        from: moment(state.dataEventCreated.start).format("YYYY-MM-DD")
      })
      setDataEventCreated({})
    }
  }, [state.dataEventCreated])

  // ** render
  const ModalCreateEvent = modalCreateEvent
  const renderSyncGoogleCalendarInfo = () => {
    return <SyncGoogleCalendarInfo syncGoogleInfo={state.syncGoogleInfo} />
  }

  return (
    <Fragment>
      <div className="p-1 calendar-index-page">
        <div className="d-flex align-items-start calendar-container">
          <div className="pe-2 sidebar-section">
            <SidebarForIndex
              dataEventCreated={state.dataEventCreated}
              filter={state.filter}
              toggleModal={toggleModal}
              setDataEventCreated={setDataEventCreated}
              setFilter={setFilter}
            />
          </div>
          <div className="calendar-section">
            <CalendarForIndex
              listCalendar={state.listCalendar}
              filter={state.filter}
              filterCalendar={state.filterCalendar}
              setFilterCalendar={setFilterCalendar}
              toggleModal={toggleModal}
            />
          </div>
        </div>
      </div>
      <ModalCreateEvent
        setDataCreateNew={undefined}
        createEventApi={calendarNodeApi.addCalendar}
        getDetailApi={calendarNodeApi.getDetailEvent}
        afterCreate={handleAfterCreateEvent}
      />
    </Fragment>
  )
}

export default FullCalendarComponent
