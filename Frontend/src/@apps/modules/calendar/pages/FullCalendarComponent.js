// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { calendarNodeApi } from "../common/api"
import moment from "moment"
// ** Styles
// ** Components=
import SidebarForIndex from "../components/sidebar/SidebarForIndex"
import CalendarForIndex from "../components/calendar/CalendarForIndex"
import SyncGoogleCalendarInfo from "../components/calendar/SyncGoogleCalendarInfo"

const FullCalendarComponent = (props) => {
  const {
    // ** props
    loading,
    listCalendar,
    filterCalendar,
    dataEventCreated,
    // ** component
    groupAllDayEvent,
    listEvent,
    // ** methods
    setFilterCalendar,
    setDataEventCreated
  } = props

  const [state, setState] = useMergedState({
    currentCalendar: {},
    syncGoogleInfo: {},
    filter: {
      from: moment().format("YYYY-MM-DD")
    },
    
    visibleAddEvent: false,
    calendarYear: moment().year()
  })

  const setFilter = (obj) => {
    setState({
      filter: {
        ...state.filter,
        ...obj
      }
    })
  }

  // ** effect
  useEffect(() => {
    if (state.visibleAddEvent === true) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [state.visibleAddEvent])

  useEffect(() => {
    if (Object.keys(dataEventCreated).length > 0) {
      setFilter({
        from: moment(dataEventCreated.start).format("YYYY-MM-DD")
      })
      setDataEventCreated({})
    }
  }, [dataEventCreated])

  // ** render
  const renderSyncGoogleCalendarInfo = () => {
    return <SyncGoogleCalendarInfo syncGoogleInfo={state.syncGoogleInfo} />
  }

  return (
    <Fragment>
      <div className="calendar-index-page">
        <div className="d-flex align-items-start calendar-container">
          <div className="pe-2 sidebar-section">
            <SidebarForIndex
              dataEventCreated={state.dataEventCreated}
              filter={state.filter}
              listEvent={listEvent}
              setDataEventCreated={setDataEventCreated}
              setFilter={setFilter}
            />
          </div>
          <div className="calendar-section">
            <CalendarForIndex
              listCalendar={listCalendar}
              filter={state.filter}
              filterCalendar={filterCalendar}
              setFilterCalendar={setFilterCalendar}
              groupAllDayEvent={groupAllDayEvent}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default FullCalendarComponent