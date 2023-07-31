// ** React Imports
import classNames from "classnames"
import moment from "moment"
// ** Styles
// ** Components

const EventItem = (props) => {
  const {
    // ** props
    item
    // ** methods
  } = props

  const isOutOfDate = moment().diff(moment(item.end)) >= 0

  // ** render
  return (
    <div className="event-item">
      <div className="d-flex align-items-center justify-content-start">
        <div className={`me-1 color bg-color-${item.color}`}></div>
        <div
          className={classNames("info", {
            "out-date-info": isOutOfDate === true
          })}>
          <h6 className="mb-0 title">{item.title}</h6>
          <span className="time">
            {moment(item.start).format("hh:mm A")} -{" "}
            {moment(item.end).format("hh:mm A")}
          </span>
        </div>
      </div>
    </div>
  )
}

export default EventItem
