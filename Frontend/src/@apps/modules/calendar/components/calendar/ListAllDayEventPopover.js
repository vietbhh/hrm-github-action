// ** React Imports
import { Fragment } from "react"
import { formatDate, useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Tag } from "antd"
// ** Components
import PerfectScrollbar from "react-perfect-scrollbar"

const ListAllDayEventPopover = (props) => {
  const {
    // ** props
    listAllDayEvent,
    date
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div>
        <div>
          <h5>{useFormatMessage("modules.calendar.title.all_day_event")}</h5>
        </div>
        <hr />
        <div>
          <p>
            <i className="far fa-calendar me-50" /> {formatDate(date)}
          </p>
          <p></p>
        </div>
        <div className="all-day-event-info">
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            {listAllDayEvent.map((item, index) => {
              return (
                <Tag
                  key={`holiday-item-${item.id}-${index}`}
                  color="gold"
                  className={`mb-1 calendar-event-item calendar-event-${item.calendar_tag.label}`}>
                  <div>
                    <p className="mb-0 event-title">
                      <i className="far fa-calendar-star me-25" /> {item.title}
                    </p>
                    <small>
                      <span className="me-25">{item.description}</span>
                      
                    </small>
                  </div>
                </Tag>
              )
            })}
          </PerfectScrollbar>
        </div>
      </div>
    </Fragment>
  )
}

export default ListAllDayEventPopover
