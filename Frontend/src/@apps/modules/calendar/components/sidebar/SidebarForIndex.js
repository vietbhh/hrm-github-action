// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { calendarNodeApi } from "../../common/api"
// ** redux
import { showAddEventCalendarModal } from "../../common/reducer/calendar"
import { useDispatch } from "react-redux"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import CalendarPickerFilter from "./CalendarPickerFilter"
import ListEvent from "./ListEvent"
import PerfectScrollbar from "react-perfect-scrollbar"

const SidebarForIndex = (props) => {
  const {
    // ** props
    filter,
    // ** methods
    setFilter
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    data: {}
  })

  const dispatch = useDispatch()

  const handleClickNewEvent = () => {
    dispatch(
      showAddEventCalendarModal({
        idEvent: 0,
        viewOnly: false
      })
    )
  }

  const loadData = () => {
    setState({
      loading: true
    })

    calendarNodeApi
      .getListEvent(filter)
      .then((res) => {
        setState({
          data: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          data: {},
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [filter])

  // ** render
  return (
    <div className="pt-4 p-50 h-100 calendar-sidebar ">
      <div className="w-100 h-100 d-flex justify-content-center">
        <div className="w-90 ">
          <div className="mb-75 pb-75 ps-75 pe-75">
            <Button.Ripple
              className="custom-button custom-primary btn-new-event"
              onClick={() => handleClickNewEvent()}>
              <i className="fas fa-plus me-75" />
              {useFormatMessage("modules.calendar.buttons.new_event")}
            </Button.Ripple>
          </div>
          <div className="mb-50">
            <CalendarPickerFilter filter={filter} setFilter={setFilter} />
          </div>

          <div className="list-event-section">
            <PerfectScrollbar>
              <ListEvent
                type="today"
                data={state.data}
                filter={filter}
                loading={state.loading}
              />
              <ListEvent
                type="tomorrow"
                data={state.data}
                filter={filter}
                loading={state.loading}
              />
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarForIndex