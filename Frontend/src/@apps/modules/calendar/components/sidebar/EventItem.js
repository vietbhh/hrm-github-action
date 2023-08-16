// ** React Imports
import classNames from "classnames"
import dayjs from "dayjs"
// ** Styles
// ** Components

const EventItem = (props) => {
  const {
    // ** props
    item
    // ** methods
  } = props

  const startDate = item.from_date ? item.from_date + " 00:00:00" :  dayjs(item.start_time_date).format("YYYY-MM-DD") + " " + dayjs(item.start_time_time).format("HH:mm:ss")
  const endDate = item.to_date ? item.to_date + " 23:59:59" : dayjs(item.end_time_date).format("YYYY-MM-DD") + " " + dayjs(item.end_time_time).format("HH:mm:ss")
  const isOutOfDate = dayjs().diff(dayjs(endDate)) >= 0

  // ** render
  return (
    <div className="event-item">
      <div className="d-flex align-items-center justify-content-start">
        <div className={`me-1 color bg-color-${item.color}`}></div>
        <div
          className={classNames("info", {
            "out-date-info": isOutOfDate === true
          })}>
          <h6 className="mb-0 title">{item.name}</h6>
          <span className="time">
            {dayjs(startDate).format("hh:mm A")} -{" "}
            {dayjs(endDate).format("hh:mm A")}
          </span>
        </div>
      </div>
    </div>
  )
}

export default EventItem
