import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { eventApi } from "@modules/Feed/common/api"
import { Dropdown } from "antd"
import classNames from "classnames"
import moment from "moment"
import React, { Fragment, useEffect } from "react"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { showDetailEventModal } from "../../../../../@apps/modules/calendar/common/reducer/calendar"

const RenderPostEvent = (props) => {
  const { dataLink, index } = props
  const [state, setState] = useMergedState({
    valueStatus: "yes"
  })
  const isImportant =
    dataLink?.important === undefined ? false : dataLink.important
  const colorEvent =
    dataLink?.color === undefined || _.isEmpty(dataLink.color)
      ? ""
      : dataLink.color.replace("#", "")

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id

  const dispatch = useDispatch()

  // ** function
  const setValueStatus = (value) => setState({ valueStatus: value })

  const handleUpdateStatus = (status) => {
    setValueStatus(status)
    const params = { id: dataLink?._id, status: status }
    eventApi
      .postUpdateEventStatus(params)
      .then((res) => {})
      .catch((err) => {})
  }

  const handleClick = () => {
    dispatch(
      showDetailEventModal({
        idEvent: dataLink?._id,
        indexEvent: index
      })
    )
  }

  // ** useEffect
  useEffect(() => {
    const employee = dataLink?.employee || []
    if (!_.isEmpty(employee) && employee !== "[]") {
      const index = employee.findIndex((val) => val.id === userId)
      if (index !== -1) {
        const status =
          employee[index].status === "" ? "respond" : employee[index].status
        setState({ valueStatus: status })
      }
    }
  }, [dataLink])

  // ** render
  const items = [
    {
      key: "yes",
      label: (
        <div onClick={() => handleUpdateStatus("yes")}>
          {useFormatMessage("modules.feed.post.event.yes")}
        </div>
      )
    },
    {
      key: "no",
      label: (
        <div onClick={() => handleUpdateStatus("no")}>
          {useFormatMessage("modules.feed.post.event.no")}
        </div>
      )
    },
    {
      key: "maybe",
      label: (
        <div onClick={() => handleUpdateStatus("maybe")}>
          {useFormatMessage("modules.feed.post.event.maybesss")}
        </div>
      )
    }
  ]

  const renderDataLinkInfo = () => {
    if (dataLink === null) {
      return ""
    }

    return (
      <Fragment>
        <div className="event-date">
          <div className="event-date__day-of-week">
            {dataLink.start_time_date
              ? moment(dataLink.start_time_date).format("ddd")
              : ""}
          </div>
          <div className="event-date__day">
            {dataLink.start_time_date
              ? moment(dataLink.start_time_date).format("DD")
              : ""}
          </div>
        </div>
        <div
          className="event-content"
          onClick={() => handleClick()}
          style={{ cursor: "pointer" }}>
          <div className="event-content__title">{dataLink?.name} xxxx</div>
          <div className="event-content__meeting-room">
            {dataLink?.meeting_room?.label}
          </div>
          <div className="event-content__people">
            {dataLink.employee ? dataLink.employee.length : 0}{" "}
            {useFormatMessage("modules.feed.post.event.people_invited")}
          </div>
          {dataLink.start_time_time ? (
            <div className="event-content__time">
              {dataLink.start_time_time
                ? moment(dataLink.start_time_time).format("hh:mm A")
                : ""}
            </div>
          ) : (
            ""
          )}
        </div>
      </Fragment>
    )
  }

  const renderIcon = (status) => {
    if (isImportant || state.valueStatus === "respond") {
      return (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 22C18 22 22.5 17.5 22.5 12C22.5 6.5 18 2 12.5 2C7 2 2.5 6.5 2.5 12C2.5 17.5 7 22 12.5 22Z"
            stroke="#696760"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.5 8V13"
            stroke="#292D32"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.4946 16H12.5036"
            stroke="#292D32"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )
    }

    if (state.valueStatus === "maybe") {
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.92 12.75H7.92C7.51 12.75 7.17 12.41 7.17 12C7.17 11.59 7.51 11.25 7.92 11.25H15.92C16.33 11.25 16.67 11.59 16.67 12C16.67 12.41 16.34 12.75 15.92 12.75Z"
            fill="#696760"
          />
        </svg>
      )
    } else if (state.valueStatus === "yes") {
      return (
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
      )
    } else {
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z"
            fill="#E52717"
          />
        </svg>
      )
    }
  }
  return (
    <Fragment>
      <div className={`post-body__event body-bg-${colorEvent}`}>
        <Fragment>{renderDataLinkInfo()}</Fragment>
        <div className="event-status">
          <Dropdown
            menu={{ items }}
            placement="bottom"
            trigger={["click"]}
            overlayClassName="feed dropdown-div-repeat dropdown-event-status"
            disabled={isImportant}>
            <div
              className={classNames("event-status__dropdown", {
                "not-accept-event": isImportant || state.valueStatus === "no",
                "accept-event": state.valueStatus === "yes"
              })}>
              <Fragment>{renderIcon()}</Fragment>
              {isImportant
                ? useFormatMessage("modules.feed.create_post.text.mandatory")
                : useFormatMessage(
                    `modules.feed.post.event.${state.valueStatus}`
                  )}
            </div>
          </Dropdown>
        </div>
      </div>
    </Fragment>
  )
}

export default RenderPostEvent
