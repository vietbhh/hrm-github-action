// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { calendarApi } from "../../common/api"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import CalendarPickerFilter from "./CalendarPickerFilter"
import ListEvent from "./ListEvent"
import moment from "moment"
import PerfectScrollbar from "react-perfect-scrollbar"

const Sidebar = (props) => {
  const {
    // ** props
    dataEventCreated,
    // ** methods
    toggleModal,
    setDataEventCreated
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    filter: {
      from: moment().format("YYYY-MM-DD")
    },
    data: {}
  })

  const setFilter = (obj) => {
    setState({
      filter: {
        ...state.filter,
        ...obj
      }
    })
  }

  const handleClickNewEvent = () => {
    toggleModal()
  }

  const loadData = () => {
    setState({
      loading: true
    })

    calendarApi
      .getListEvent(state.filter)
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
  }, [state.filter])

  useEffect(() => {
    if (Object.keys(dataEventCreated).length > 0) {
      setFilter({
        from: moment(dataEventCreated.start).format("YYYY-MM-DD")
      })
      setDataEventCreated({})
    }
  }, [dataEventCreated])

  // ** render
  return (
    <div className="pt-4 p-50 h-100 calendar-sidebar ">
      <div className="w-100 h-100 d-flex justify-content-center">
        <div className="w-90 ">
          <div className="mb-2 pb-75 ps-75 pe-75">
            <Button.Ripple
              className="custom-button custom-primary btn-new-event"
              onClick={() => handleClickNewEvent()}>
              <i className="fas fa-plus me-75" />
              {useFormatMessage("modules.calendar.buttons.new_event")}
            </Button.Ripple>
          </div>
          <div className="mb-2">
            <CalendarPickerFilter filter={state.filter} setFilter={setFilter} />
          </div>

          <div className="list-event-section">
            <PerfectScrollbar>
              <ListEvent
                type="today"
                data={state.data}
                filter={state.filter}
                loading={state.loading}
              />
              <ListEvent
                type="tomorrow"
                data={state.data}
                filter={state.filter}
                loading={state.loading}
              />
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
