// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import moment from "moment"
// ** Styles
// ** Components
import EventItem from "../../../../@apps/modules/calendar/components/sidebar/EventItem"

const ListEventHRM = (props) => {
  const {
    // ** props
    type,
    filter,
    data,
    loading
    // ** methods
  } = props
  
  const date =
    type === "today"
      ? moment(filter.from).format("DD/MM/YYYY")
      : moment(filter.from).add(1, "days").format("DD/MM/YYYY")

  const _getAllDayEvent = (item) => {
    if (item?.all_day_event === true) {
      return item.list_event
    } else if (item?.is_dob === true) {
      return item.employee_info
    } else if (item?.is_holiday === true) {
      return item.holiday_info
    }
  }

  // ** render
  const renderList = () => {
    if (loading) {
      return ""
    }

    const currentData = data[type] === undefined ? [] : data[type]
    if (currentData === undefined) {
      return ""
    }
    
    return (
      <Fragment>
        {currentData.map((item, index) => {
          if (item.allday === true) {
            const allDayData = _getAllDayEvent(item)
            return (
              <Fragment key={`event-item-all-day-${index}`}>
                {allDayData.map((itemAllDay, indexAllDay) => {
                  return (
                    <EventItem
                      isAllDay={true}
                      key={`event-all-day-${index}-${indexAllDay}`}
                      item={itemAllDay}
                    />
                  )
                })}
              </Fragment>
            )
          } else {
            return (
              <EventItem
                isAllDay={false}
                key={`event-item-${item._id}`}
                item={item}
              />
            )
          }
        })}
      </Fragment>
    )
  }

  return (
    <div className="list-event">
      <div className="d-flex align-items-center justify-content-start mb-2 head">
        <h6 className="mb-0 me-50 title">
          {useFormatMessage(`modules.calendar.text.${type}`)}
        </h6>
        <span className="date">{date}</span>
      </div>
      <div className="body">
        <Fragment>{renderList()}</Fragment>
      </div>
    </div>
  )
}

export default ListEventHRM
