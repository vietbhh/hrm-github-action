// ** Custom Components
import ListNotification from "./ListNotification"

// ** Third Party Components
import { useFormatMessage } from "@apps/utility/common"
import PerfectScrollbar from "react-perfect-scrollbar"
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip
} from "reactstrap"

import { defaultModuleApi } from "@apps/utility/moduleApi"
import { Link, useNavigate } from "react-router-dom"

// ** redux
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { handleSeenNotification, toggleOpenDropdown } from "redux/notification"

const NotificationDropdown = () => {
  const notification = useSelector((state) => state.notification)
  const listNotificationStore = notification.listNotification
  const numberNotificationStore = notification.numberNotification
  const openDropdown = notification.openDropdown

  const [focusIconNotification, setFocusIconNotification] = useState(false)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleClick = (e) => {
    defaultModuleApi
      .get("/notification/read")
      .then((res) => {
        const listNotificationSeen = Object.values(
          res.data.list_notification_seen
        )
        const numberNotificationSeen = res.data.number_notification_seen
        dispatch(
          handleSeenNotification({
            listNotificationSeen,
            numberNotificationSeen
          })
        )
      })
      .catch((err) => {})
  }

  const handleToggleDropdown = () => {
    setFocusIconNotification(!focusIconNotification)
    dispatch(toggleOpenDropdown())
  }

  const handleClickSeeAll = () => {
    navigate("/notification")
    dispatch(toggleOpenDropdown(false))
  }

  useEffect(() => {
    if (!notification.openDropdown) {
      setFocusIconNotification(false)
    }
  }, [notification.openDropdown])

  const renderListNotification = () => {
    if (listNotificationStore.length > 0) {
      return (
        <Fragment>
          <PerfectScrollbar
            component="li"
            className="noti-list scrollable-container"
            options={{
              wheelPropagation: false
            }}>
            <ListNotification listNotification={listNotificationStore} />
          </PerfectScrollbar>
          <li className="p-1">
            <Button.Ripple
              color="primary"
              block
              onClick={() => handleClickSeeAll()}>
              {useFormatMessage(
                "layout.notification.see_all_incoming_activity"
              )}
            </Button.Ripple>
          </li>
        </Fragment>
      )
    }

    return (
      <p className="ps-3 pb-2">
        {useFormatMessage("notification.no_notification")}
      </p>
    )
  }

  return (
    <Dropdown
      isOpen={openDropdown}
      toggle={() => handleToggleDropdown()}
      tag="li"
      className="dropdown-notification nav-item">
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => {
          e.preventDefault()
          if (numberNotificationStore > 0) handleClick(e)
        }}
        id="notification">
        {focusIconNotification ? (
          <svg
            className="bell"
            xmlns="http://www.w3.org/2000/svg"
            width="31"
            height="31"
            viewBox="0 0 31 31"
            fill="none">
            <path
              d="M25.5356 15.0419C24.5921 13.94 24.1633 12.9852 24.1633 11.363V10.8114C24.1633 8.69746 23.6767 7.33544 22.6189 5.97341C20.9886 3.85818 18.244 2.58331 15.5571 2.58331H15.4429C12.8125 2.58331 10.1539 3.79964 8.49527 5.82902C7.3797 7.21836 6.83668 8.63892 6.83668 10.8114V11.363C6.83668 12.9852 6.43615 13.94 5.46436 15.0419C4.74932 15.8536 4.52081 16.8969 4.52081 18.0261C4.52081 19.1566 4.89181 20.2272 5.63638 21.0975C6.60817 22.1408 7.98049 22.8068 9.38233 22.9226C11.4119 23.1542 13.4415 23.2413 15.5006 23.2413C17.5585 23.2413 19.588 23.0956 21.6189 22.9226C23.0195 22.8068 24.3918 22.1408 25.3636 21.0975C26.1069 20.2272 26.4791 19.1566 26.4791 18.0261C26.4791 16.8969 26.2506 15.8536 25.5356 15.0419Z"
              fill="#3F8CFF"
            />
            <path
              opacity="0.4"
              d="M18.0945 24.8366C17.4488 24.6987 13.5141 24.6987 12.8684 24.8366C12.3164 24.9641 11.7195 25.2607 11.7195 25.9112C11.7516 26.5317 12.1149 27.0794 12.6181 27.4267L12.6168 27.428C13.2677 27.9353 14.0315 28.258 14.8313 28.3737C15.2575 28.4323 15.6914 28.4297 16.133 28.3737C16.9315 28.258 17.6953 27.9353 18.3461 27.428L18.3449 27.4267C18.8481 27.0794 19.2114 26.5317 19.2435 25.9112C19.2435 25.2607 18.6465 24.9641 18.0945 24.8366Z"
              fill="#3F8CFF"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="28"
            viewBox="0 0 23 28"
            fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.5 21.3096C18.549 21.3096 21.8101 20.4053 22.125 16.7756C22.125 13.1485 19.8514 13.3817 19.8514 8.93139C19.8514 5.45517 16.5565 1.5 11.5 1.5C6.44346 1.5 3.14856 5.45517 3.14856 8.93139C3.14856 13.3817 0.875 13.1485 0.875 16.7756C1.19119 20.419 4.45222 21.3096 11.5 21.3096Z"
              stroke="#32434F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.486 25.0715C12.7808 26.9649 10.1208 26.9874 8.39935 25.0715"
              stroke="#32434F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {numberNotificationStore > 0 && (
          <Badge pill color="warning" className="badge-up">
            {numberNotificationStore}
          </Badge>
        )}

        <UncontrolledTooltip target="notification">
          {useFormatMessage("layout.notification.title")}
        </UncontrolledTooltip>
      </DropdownToggle>
      <DropdownMenu tag="ul" end className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">
              {useFormatMessage("layout.notification.recent_notification")}
            </h4>
          </DropdownItem>
        </li>
        {renderListNotification()}
      </DropdownMenu>
    </Dropdown>
  )
}

export default NotificationDropdown
