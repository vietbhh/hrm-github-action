// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { calendarNodeApi } from "../common/api"
import { getArrWeekDate } from "../common/common"
import moment from "moment"
import dayjs from "dayjs"
// ** redux
// ** Styles
// ** Components
import ModalCreateEvent from "../components/modal/ModalCreateEvent"
import FullCalendarComponent from "./FullCalendarComponent"
import GroupAllDayEvent from "../components/calendar/GroupAllDayEvent"
import ListEvent from "../components/sidebar/ListEvent"

const CalendarIndex = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    listCalendar: [],
    filterCalendar: {
      from: getArrWeekDate().shift(),
      to: getArrWeekDate().pop()
    },
    dataEventCreated: {}
  })

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
              isAllDay: item?.all_day_event,
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

  // ** effect
  useEffect(() => {
    loadCalendar()
  }, [state.filterCalendar])

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
        listEvent={ListEvent}
      />
      <ModalCreateEvent
        setDataCreateNew={undefined}
        createEventApi={calendarNodeApi.addCalendar}
        getDetailApi={calendarNodeApi.getDetailEvent}
        afterCreate={handleAfterCreateEvent}
      />
    </Fragment>
  )
}

export default CalendarIndex
