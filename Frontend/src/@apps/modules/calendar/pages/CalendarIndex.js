// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
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
import { Card, CardBody, Row, Col } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import Sidebar from "../components/sidebar/Sidebar"
import Calendar from "../components/calendar/Calendar"
import AddEventModal from "../components/modal/AddEventModal"
import SyncGoogleCalendarInfo from "../components/calendar/SyncGoogleCalendarInfo"

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
    changeYearType: ""
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
            state.calendarsColor[item.calendar_tag?.label] === undefined
              ? "all-day-event"
              : state.calendarsColor[item.calendar_tag?.label]
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
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[{ title: useFormatMessage("modules.calendar.title.calendar") }]}
      />
    )
  }

  const renderSidebar = () => {
    return (
      <Sidebar
        listCalendarTag={state.listCalendarTag}
        listCalendar={state.listCalendar}
        filters={state.filters}
        calendarYear={state.calendarYear}
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
        changeYearType={state.changeYearType}
        calendarYear={state.calendarYear}
        handleShowAddEventModal={handleShowAddEventModal}
        setCalendarYear={setCalendarYear}
      />
    )
  }

  const renderSyncGoogleCalendarInfo = () => {
    return <SyncGoogleCalendarInfo syncGoogleInfo={state.syncGoogleInfo} />
  }

  const renderAddEventModal = () => {
    return (
      <AddEventModal
        handleHideAddEventModal={handleHideAddEventModal}
        loadCalendar={loadCalendar}
      />
    )
  }

  const renderComponent = () => {
    return (
      <Fragment>
        {renderBreadcrumb()}
        <Card className="calendar">
          <CardBody>
            <Row>
              <Col sm={2} className="pe-25 mt-3">
                <Fragment>{renderSidebar()}</Fragment>
                <Fragment>{renderSyncGoogleCalendarInfo()}</Fragment>
              </Col>
              <Col sm={10}>{renderCalendar()}</Col>
            </Row>
          </CardBody>
        </Card>
        {renderAddEventModal()}
      </Fragment>
    )
  }

  return !state.loading && renderComponent()
}

export default CalendarIndex
