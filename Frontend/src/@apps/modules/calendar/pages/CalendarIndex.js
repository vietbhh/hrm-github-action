// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { calendarApi } from "../common/api"
import moment from "moment"
// ** redux
import {
  showAddEventCalendarModal,
  hideAddEventCalendarModal,
  removeCurrentCalendar
} from "../common/reducer/calendar"
import { useDispatch } from "react-redux"
// ** Styles
// ** Components=
import Sidebar from "../components/sidebar/Sidebar"
import CalendarForIndex from "../components/calendar/CalendarForIndex"
import AddEventModal from "../components/modal/AddEventModal"
import SyncGoogleCalendarInfo from "../components/calendar/SyncGoogleCalendarInfo"
import ModalCreateEvent from "../components/modal/ModalCreateEvent"

const CalendarIndex = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    loadingCalendar: false,
    listCalendar: [],
    listCalendarTag: [],
    calendarsColor: [],
    currentCalendar: {},
    syncGoogleInfo: {},
    filters: {
      calendarTag: "all"
    },
    visibleAddEvent: false,
    calendarYear: moment().year(),
    changeYearType: "",
    modal: false,
    dataEventCreated: {}
  })

  const setFilter = (filter) => {
    setState({
      filters: {
        ...state.filters,
        ...filter
      }
    })
  }

  const dispatch = useDispatch()

  const handleShowAddEventModal = (data) => {
    dispatch(removeCurrentCalendar())
    dispatch(showAddEventCalendarModal(data))
  }

  const handleHideAddEventModal = () => {
    dispatch(hideAddEventCalendarModal())
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
          syncGoogleInfo: res.data.user_sync,
          calendarsColor: listColor,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          listCalendarTag: [],
          calendarsColor: {},
          syncGoogleInfo: {},
          loading: false
        })
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
    calendarApi
      .getCalendar({ calendarTag: [state.filters.calendarTag] })
      .then((res) => {
        const data = res.data.results
        const newCalendar = data.map((item) => {
          let color =
          item.color === null
              ? "all-day-event"
              : item.color
          if (item["is_dob"] !== undefined) {
            color = "danger"
          }
          const editable = item["is_dob"] === undefined
          return {
            id: item.id,
            start: item.start,
            end: item.end,
            title: item.title,
            allDay: item.allday,
            editable: editable,
            calendar_tag: item.calendar_tag,
            extendedProps: {
              isAllDay: item?.is_all_day,
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
    loadCalendarTag()
  }, [])

  useEffect(() => {
    if (state.loading === false) {
      loadCalendar()
    }
  }, [state.filters, state.loading])

  useEffect(() => {
    if (state.visibleAddEvent === true) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [state.visibleAddEvent])

  // ** render
  const renderSyncGoogleCalendarInfo = () => {
    return <SyncGoogleCalendarInfo syncGoogleInfo={state.syncGoogleInfo} />
  }

  const renderModalCreateEvent = () => {
    if (state.modal) {
      return (
        <ModalCreateEvent
          modal={state.modal}
          toggleModal={toggleModal}
          options_employee_department={[]}
          optionsMeetingRoom={[]}
          setDataCreateNew={undefined}
          createEventApi={calendarApi.addCalendar}
          afterCreate={handleAfterCreateEvent}
        />
      )
    }

    return ""
  }

  const renderComponent = () => {
    return (
      <Fragment>
        <div className="p-1 calendar-index-page">
          <div className="d-flex align-items-start calendar-container">
            <div className="pe-2 sidebar-section">
              <Sidebar
                listCalendarTag={state.listCalendarTag}
                listCalendar={state.listCalendar}
                filters={state.filters}
                calendarYear={state.calendarYear}
                dataEventCreated={state.dataEventCreated}
                setFilter={setFilter}
                handleShowAddEventModal={handleShowAddEventModal}
                setListCalendar={setListCalendar}
                setCalendarYear={setCalendarYear}
                setChangeYearType={setChangeYearType}
                toggleModal={toggleModal}
                setDataEventCreated={setDataEventCreated}
              />
            </div>
            <div className="calendar-section">
              <CalendarForIndex
                listCalendar={state.listCalendar}
                changeYearType={state.changeYearType}
                calendarYear={state.calendarYear}
                handleShowAddEventModal={handleShowAddEventModal}
                setCalendarYear={setCalendarYear}
              />
            </div>
          </div>
        </div>
        <Fragment>{renderModalCreateEvent()}</Fragment>
      </Fragment>
    )
  }

  return !state.loading && renderComponent()
}

export default CalendarIndex
