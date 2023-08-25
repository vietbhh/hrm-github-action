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
  const colorEvent = (dataLink?.color === undefined || _.isEmpty(dataLink.color)) ? "" : dataLink.color.replace("#", "")

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
        const status = employee[index].status
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
          {useFormatMessage("modules.feed.post.event.maybe")}
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
          <div className="event-content__title">{dataLink?.name}</div>
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
    if (state.valueStatus === "maybe") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 20 20"
          fill="none">
          <path
            d="M14.1667 15.3583H10.8334L7.12501 17.8249C6.57501 18.1916 5.83335 17.8 5.83335 17.1333V15.3583C3.33335 15.3583 1.66669 13.6916 1.66669 11.1916V6.19157C1.66669 3.69157 3.33335 2.0249 5.83335 2.0249H14.1667C16.6667 2.0249 18.3334 3.69157 18.3334 6.19157V11.1916C18.3334 13.6916 16.6667 15.3583 14.1667 15.3583Z"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 9.46655V9.29159C10 8.72492 10.35 8.4249 10.7 8.18324C11.0417 7.9499 11.3833 7.64991 11.3833 7.09991C11.3833 6.33325 10.7667 5.71655 10 5.71655C9.23334 5.71655 8.6167 6.33325 8.6167 7.09991"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.99623 11.4584H10.0037"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 20 20"
          fill="none">
          <path
            d="M10 1.66675C5.40835 1.66675 1.66669 5.40841 1.66669 10.0001C1.66669 14.5917 5.40835 18.3334 10 18.3334C14.5917 18.3334 18.3334 14.5917 18.3334 10.0001C18.3334 5.40841 14.5917 1.66675 10 1.66675ZM12.8 11.9167C13.0417 12.1584 13.0417 12.5584 12.8 12.8001C12.675 12.9251 12.5167 12.9834 12.3584 12.9834C12.2 12.9834 12.0417 12.9251 11.9167 12.8001L10 10.8834L8.08335 12.8001C7.95835 12.9251 7.80002 12.9834 7.64169 12.9834C7.48335 12.9834 7.32502 12.9251 7.20002 12.8001C6.95835 12.5584 6.95835 12.1584 7.20002 11.9167L9.11669 10.0001L7.20002 8.08341C6.95835 7.84175 6.95835 7.44175 7.20002 7.20008C7.44169 6.95842 7.84169 6.95842 8.08335 7.20008L10 9.11675L11.9167 7.20008C12.1584 6.95842 12.5584 6.95842 12.8 7.20008C13.0417 7.44175 13.0417 7.84175 12.8 8.08341L10.8834 10.0001L12.8 11.9167Z"
            fill="#4F4D55"
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
            overlayClassName="feed dropdown-div-repeat dropdown-event-status">
            <div
              className={classNames("event-status__dropdown", {
                "not-accept-event": state.valueStatus !== "yes"
              })}>
              <Fragment>{renderIcon()}</Fragment>
              {useFormatMessage(`modules.feed.post.event.${state.valueStatus}`)}
            </div>
          </Dropdown>
        </div>
      </div>
    </Fragment>
  )
}

export default RenderPostEvent
