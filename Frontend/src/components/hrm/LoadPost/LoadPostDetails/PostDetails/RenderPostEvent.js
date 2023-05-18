import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Dropdown } from "antd"
import moment from "moment"
import React from "react"

const RenderPostEvent = (props) => {
  const { dataLink } = props
  const [state, setState] = useMergedState({
    valueStatus: "yes"
  })

  // ** function
  const setValueStatus = (value) => setState({ valueStatus: value })

  // ** render
  const items = [
    {
      key: "yes",
      label: (
        <div onClick={() => setValueStatus("yes")}>
          {useFormatMessage("modules.feed.post.event.yes")}
        </div>
      )
    },
    {
      key: "no",
      label: (
        <div onClick={() => setValueStatus("no")}>
          {useFormatMessage("modules.feed.post.event.no")}
        </div>
      )
    },
    {
      key: "maybe",
      label: (
        <div onClick={() => setValueStatus("maybe")}>
          {useFormatMessage("modules.feed.post.event.maybe")}
        </div>
      )
    }
  ]

  return (
    <div className="post-body__event">
      <div className="event-date">
        <div className="event-date__day-of-week">
          {dataLink.start_time_date
            ? moment(dataLink.start_time_date).format("ddd")
            : ""}
        </div>
        <div className="event-date__day">
          {" "}
          {dataLink.start_time_date
            ? moment(dataLink.start_time_date).format("DD")
            : ""}
        </div>
      </div>
      <div className="event-content">
        <div className="event-content__title">{dataLink?.name}</div>
        <div className="event-content__meeting-room">
          {dataLink?.meeting_room?.label}
        </div>
        <div className="event-content__people">
          {dataLink.employee ? dataLink.employee.length : 0}{" "}
          {useFormatMessage("modules.feed.post.event.people_invited")}
        </div>
        <div className="event-content__time">
          {dataLink.start_time_time
            ? moment(dataLink.start_time_time).format("hh:mm A")
            : ""}
        </div>
      </div>
      <div className="event-status">
        <Dropdown
          menu={{ items }}
          placement="bottom"
          trigger={["click"]}
          overlayClassName="feed dropdown-div-repeat dropdown-event-status">
          <div className="event-status__dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                fill="#139FF8"
              />
            </svg>
            Accepted
            {/* {state.valueStatus} */}
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default RenderPostEvent
