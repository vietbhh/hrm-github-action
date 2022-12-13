// ** Custom Components
import Avatar from "@apps/modules/download/pages/Avatar"
import ListNotification from "./ListNotification"

// ** Third Party Components
import { useFormatMessage } from "@apps/utility/common"
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  UncontrolledTooltip
} from "reactstrap"

import { Link } from "react-router-dom"
import { defaultModuleApi } from "@apps/utility/moduleApi"

// ** redux
import { useSelector, useDispatch } from "react-redux"
import { handleSeenNotification } from "redux/notification"

const NotificationDropdown = () => {
  const notification = useSelector((state) => state.notification)
  const listNotificationStore = notification.listNotification
  const numberNotificationStore = notification.numberNotification

  const dispatch = useDispatch()

  const handleClick = (e) => {
    e.preventDefault()
    defaultModuleApi
      .get("/notification/seen-notification")
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

  // ** Function to render Notifications
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="noti-list scrollable-container"
        options={{
          wheelPropagation: false
        }}>
        <a href="/" onClick={(e) => e.preventDefault()}>
          <div className={classnames("d-flex align-items-center div-noti")}>
            <div className="div-img">
              <Avatar src={""} imgHeight="48" imgWidth="48" className="img" />
              <Badge pill color="warning" className="badge-up">
                <i className="iconly-Chat icbo icon"></i>
              </Badge>
            </div>
            <div className="div-text">
              <span className="text-title">Sarah Saunders</span>
              <span className="text-content">
                Commentted on{" "}
                <span className="text-content-blue">Collab Design</span>
              </span>
            </div>
            <div className="div-time">8h</div>
          </div>

          <div
            className={classnames(
              "d-flex align-items-center div-noti bg-active"
            )}>
            <div className="div-img">
              <Avatar src={""} imgHeight="48" imgWidth="48" className="img" />
              <Badge pill color="warning" className="badge-up badge-up-green">
                <i className="iconly-Message icbo icon"></i>
              </Badge>
            </div>
            <div className="div-text">
              <span className="text-title">Sarah Saunders</span>
              <span className="text-content">
                Commentted on{" "}
                <span className="text-content-blue">Collab Design</span>
              </span>
            </div>
            <div className="div-time">8h</div>
          </div>

          <div className={classnames("d-flex align-items-center div-noti")}>
            <div className="div-img">
              <Avatar src={""} imgHeight="48" imgWidth="48" className="img" />
              <Badge pill color="warning" className="badge-up badge-up-purple">
                <i className="iconly-Chat icbo icon"></i>
              </Badge>
            </div>
            <div className="div-text">
              <span className="text-title">Sarah Saunders</span>
              <span className="text-content">
                Commentted on{" "}
                <span className="text-content-blue">Collab Design</span>
              </span>
            </div>
            <div className="div-time">8h</div>
          </div>

          <div
            className={classnames(
              "d-flex align-items-center div-noti bg-gray"
            )}>
            <div className="div-img">
              <Avatar src={""} imgHeight="48" imgWidth="48" className="img" />
              <Badge pill color="warning" className="badge-up badge-up-orange">
                <i className="iconly-Chat icbo icon"></i>
              </Badge>
            </div>
            <div className="div-text">
              <span className="text-title">Sarah Saunders</span>
              <span className="text-content">
                Commentted on{" "}
                <span className="text-content-blue">Collab Design</span>
              </span>
            </div>
            <div className="div-time">8h</div>
          </div>

          <div className={classnames("d-flex align-items-center div-noti")}>
            <div className="div-img">
              <Avatar src={""} imgHeight="48" imgWidth="48" className="img" />
              <Badge pill color="warning" className="badge-up">
                <i className="iconly-Chat icbo icon"></i>
              </Badge>
            </div>
            <div className="div-text">
              <span className="text-title">Sarah Saunders</span>
              <span className="text-content">
                Commentted on{" "}
                <span className="text-content-blue">Collab Design</span>
              </span>
            </div>
            <div className="div-time">8h</div>
          </div>

          <div className={classnames("d-flex align-items-center div-noti")}>
            <div className="div-img">
              <Avatar src={""} imgHeight="48" imgWidth="48" className="img" />
              <Badge pill color="warning" className="badge-up">
                <i className="iconly-Chat icbo icon"></i>
              </Badge>
            </div>
            <div className="div-text">
              <span className="text-title">Sarah Saunders</span>
              <span className="text-content">
                Commentted on{" "}
                <span className="text-content-blue">Collab Design</span>
              </span>
            </div>
            <div className="div-time">8h</div>
          </div>
        </a>
      </PerfectScrollbar>
    )
  }

  const renderListNotification = () => {
    if (listNotificationStore.length > 0) {
      return (
        <PerfectScrollbar
          component="li"
          className="noti-list scrollable-container"
          options={{
            wheelPropagation: false
          }}>
          <ListNotification listNotification={listNotificationStore} />
        </PerfectScrollbar>
      )
    }

    return ""
  }

  return (
    <UncontrolledDropdown tag="li" className="dropdown-notification nav-item">
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => handleClick(e)}
        id="notification">
        <svg
          className="bell"
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18 11V8C18 4.13401 14.866 1 11 1C7.13401 1 4 4.13401 4 8V11C4 14.3 1 15.1 1 17C1 18.7 4.9 20 11 20C17.1 20 21 18.7 21 17C21 15.1 18 14.3 18 11Z"
            stroke="#00003B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 22C9.98902 22 9.03902 21.966 8.14502 21.9C8.53619 23.1478 9.69236 23.997 11 23.997C12.3077 23.997 13.4639 23.1478 13.855 21.9C12.961 21.966 12.011 22 11 22Z"
            fill="#00003B"
          />
        </svg>

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
        <li className="dropdown-menu-footer">
          <Link to="/notification">
            <Button.Ripple color="primary" block>
              {useFormatMessage(
                "layout.notification.see_all_incoming_activity"
              )}
            </Button.Ripple>
          </Link>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
