// ** React Imports
import { Fragment } from "react"
import { getOptionValue, useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Tag } from "antd"
// ** Components
import PerfectScrollbar from "react-perfect-scrollbar"

const ListTimeOffPopover = (props) => {
  const {
    // ** props
    listTimeOff
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div>
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="mb-0">
            {useFormatMessage("modules.calendar.title.time_off")}
          </h4>
          <p className="mb-0">
            <Tag className="me-50" color="green">
              {useFormatMessage(
                "modules.time_off_requests.app_options.status.approved"
              )}
            </Tag>
            <Tag color="orange">
              {useFormatMessage(
                "modules.time_off_requests.app_options.status.pending"
              )}
            </Tag>
          </p>
        </div>
        <hr />
        <div className="employee-time-off-info">
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            {listTimeOff.map((item, index) => {
              return (
                <Tag
                  className="d-block mb-1 pb-50 pt-50"
                  key={`time-off-item-${item.id}-${index}`}
                  color={item.is_pending ? "orange" : "green"}>
                  <div>
                    <p className="mb-0">
                      <i className="fad fa-calendar-day me-25" />
                      <span className="me-25">{item.from_date}</span>
                      <span>
                        {useFormatMessage("modules.calendar.text.to")}{" "}
                        {item.to_date}
                      </span>
                    </p>
                    <p className="mt-25 mb-0">
                      <b>{useFormatMessage("modules.calendar.text.type")}: </b>{" "}
                      {item.type_name}
                    </p>
                    <p className="mt-25 mb-0">
                      <b>{useFormatMessage("modules.calendar.text.note")}: </b>{" "}
                      {item.note}
                    </p>
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

export default ListTimeOffPopover
