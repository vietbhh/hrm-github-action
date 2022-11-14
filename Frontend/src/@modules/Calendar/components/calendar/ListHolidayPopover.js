// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Tag } from "antd"
// ** Components

const ListHolidayPopover = (props) => {
  const {
    // ** props
    listHoliday
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div>
        <div>
          <h4>{useFormatMessage("modules.calendar.title.holiday")}</h4>
        </div>
        <hr />
        <div>
          {listHoliday.map((item, index) => {
            return (
              <Tag
                key={`holiday-item-${item.id}-${index}`}
                color="gold"
                className="mb-1">
                <div>
                  <p className="mb-0">
                    <i className="far fa-calendar-star me-25" /> {item.name}
                  </p>
                  <small>
                    <span className="me-25">{item.from_date}</span>
                    <span>
                      {useFormatMessage("modules.calendar.text.to")}{" "}
                      {item.to_date}
                    </span>
                  </small>
                </div>
              </Tag>
            )
          })}
        </div>
      </div>
    </Fragment>
  )
}

export default ListHolidayPopover
