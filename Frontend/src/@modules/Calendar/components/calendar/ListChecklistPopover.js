// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, formatDate } from "@apps/utility/common"
// ** Styles
import { Tag } from "antd"
// ** Components
import PerfectScrollbar from "react-perfect-scrollbar"

const ListChecklistPopover = (props) => {
  const {
    // ** props
    listChecklist,
    date
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div>
        <div>
          <h5>{useFormatMessage("modules.calendar.title.checklist")}</h5>
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
            {listChecklist.map((item, index) => {
              return (
                <Tag
                  key={`holiday-item-${item.id}-${index}`}
                  color="gold"
                  className={`mb-1 calendar-event-item calendar-event-checklist`}>
                  <div>
                    <p className="mb-0 event-title">
                      <i className="far fa-calendar-star me-25" />{" "}
                      {item.task_name}
                    </p>
                    <small className="event-description">
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

export default ListChecklistPopover
