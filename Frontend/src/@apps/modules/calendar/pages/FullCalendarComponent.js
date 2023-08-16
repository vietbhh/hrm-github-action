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
    // ** component
    groupAllDayEvent,
    // ** methods
    setFilterCalendar
  } = props

  const [state, setState] = useMergedState({
    currentCalendar: {},
    syncGoogleInfo: {},
    filter: {
      from: moment().format("YYYY-MM-DD")
    },
    
    visibleAddEvent: false,
    calendarYear: moment().year(),
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

  const setDataEventCreated = (obj) => {
    setState({
      dataEventCreated: obj
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
    if (Object.keys(state.dataEventCreated).length > 0) {
      setFilter({
        from: moment(state.dataEventCreated.start).format("YYYY-MM-DD")
      })
      setDataEventCreated({})
    }
  }, [state.dataEventCreated])

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
