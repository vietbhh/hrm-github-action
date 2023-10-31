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
import { useNavigate } from "react-router-dom"

// ** redux
import { handleSeenNotification } from "@store/notification"
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const NotificationDropdown = () => {
  const notification = useSelector((state) => state.notification)
  const listNotificationStore = notification.listNotification
  const numberNotificationStore = notification.numberNotification

  const [focusIconNotification, setFocusIconNotification] = useState(false)
  const [open, setOpen] = useState(false)

  const toggleOpen = (status = undefined) => {
    setOpen(status === undefined ? !open : status)
  }

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleClick = (e) => {
    defaultModuleApi
      .get("/notification/seen")
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
    setOpen(!open)
  }

  const handleClickSeeAll = () => {
    navigate("/notification")
    setOpen(false)
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
            <ListNotification
              listNotification={listNotificationStore}
              showDropdownAction={false}
              toggleOpen={toggleOpen}
            />
          </PerfectScrollbar>
          <li className="p-1 pt-2 pb-2 d-flex justify-content-center footer-noti">
            <Button.Ripple color="primary" onClick={() => handleClickSeeAll()}>
              {useFormatMessage("layout.notification.see_all_notification")}
            </Button.Ripple>
          </li>
        </Fragment>
      )
    }

    return (
      <p className="empty-notification">
        {useFormatMessage("notification.no_notification")}
      </p>
    )
  }

  return (
    <Dropdown
      isOpen={open}
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
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="26"
            viewBox="0 0 23 27"
            fill="none">
            <path
              d="M21.5356 13.0419C20.5921 11.94 20.1633 10.9852 20.1633 9.36297V8.8114C20.1633 6.69746 19.6767 5.33544 18.6189 3.97341C16.9886 1.85818 14.244 0.583313 11.5571 0.583313H11.4429C8.81247 0.583313 6.15385 1.79964 4.49526 3.82902C3.3797 5.21836 2.83668 6.63892 2.83668 8.8114V9.36297C2.83668 10.9852 2.43615 11.94 1.46436 13.0419C0.749318 13.8536 0.520813 14.8969 0.520813 16.0261C0.520813 17.1566 0.891813 18.2272 1.63638 19.0975C2.60817 20.1408 3.98049 20.8068 5.38233 20.9226C7.41192 21.1542 9.44151 21.2413 11.5006 21.2413C13.5585 21.2413 15.588 21.0956 17.6189 20.9226C19.0195 20.8068 20.3918 20.1408 21.3636 19.0975C22.1069 18.2272 22.4791 17.1566 22.4791 16.0261C22.4791 14.8969 22.2506 13.8536 21.5356 13.0419"
              fill="#3F8CFF"
            />
            <path
              opacity="0.4"
              d="M14.0945 22.8366C13.4488 22.6987 9.51415 22.6987 8.86843 22.8366C8.31642 22.9641 7.71948 23.2607 7.71948 23.9112C7.75158 24.5317 8.11487 25.0794 8.6181 25.4267L8.61682 25.428C9.26767 25.9353 10.0315 26.258 10.8313 26.3737C11.2575 26.4323 11.6914 26.4297 12.133 26.3737C12.9315 26.258 13.6953 25.9353 14.3461 25.428L14.3449 25.4267C14.8481 25.0794 15.2114 24.5317 15.2435 23.9112C15.2435 23.2607 14.6465 22.9641 14.0945 22.8366"
              fill="#3F8CFF"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.5 19.5C18.8027 19.5 21.7184 18.6783 22 15.3802C22 12.0844 19.9672 12.2964 19.9672 8.25255C19.9672 5.09388 17.0211 1.5 12.5 1.5C7.97886 1.5 5.03283 5.09388 5.03283 8.25255C5.03283 12.2964 3 12.0844 3 15.3802C3.28271 18.6908 6.19845 19.5 12.5 19.5Z"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.608 22.4714C13.4043 23.8347 11.5267 23.8508 10.3115 22.4714"
              stroke="#696760"
              strokeWidth="1.5"
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
        <li className="pb-0 mb-0 dropdown-menu-header">
          <DropdownItem className="pb-0 d-flex" tag="div" header>
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
