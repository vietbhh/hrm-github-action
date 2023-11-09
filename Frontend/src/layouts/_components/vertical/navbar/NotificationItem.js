// ** React Imports
import {
  checkHTMLTag,
  handleFormatMessageStr
} from "layouts/_components/vertical/common/common"
import { Fragment, useState } from "react"
import classnames from "classnames"
import { useNavigate } from "react-router-dom"
import {
  getDefaultFridayLogo,
  timeDifference,
  useFormatMessage
} from "@apps/utility/common"
import { notificationApi } from "@apps/modules/notification/common/api"
// ** redux
import {
  handleReadNotification,
  handleRemoveNotification
} from "@store/notification"
import { useDispatch, useSelector } from "react-redux"
// ** Styles
import { Dropdown } from "antd"
import { Button } from "reactstrap"
// ** Components
import NotificationAction from "./NotificationAction"

const NotificationItem = (props) => {
  const {
    // ** props
    item,
    showDropdownAction = true,
    itemsDropDown = [],
    // ** methods
    toggleOpen,
    setNotificationData
  } = props

  const notificationLink = item.link !== undefined ? item.link.trim() : ""

  const [isHover, setIsHover] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)

  const settingState = useSelector((state) => state.auth.settings)
  const notificationDB =
    settingState?.notification_db === undefined
      ? "mysql"
      : settingState.notification_db
  const notificationId = notificationDB === "mongo" ? "_id" : "id"

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleClickNotification = async () => {
    if (item.read === false) {
      await readNotification()
    }

    if (notificationLink.length > 0) {
      if (_.isFunction(toggleOpen)) {
        toggleOpen(false)
      }
      navigate(notificationLink)
    }
  }

  const handleClickNotificationAction = (e) => {
    e.preventDefault()
    setIsHover(true)
  }

  const handleMouseLeave = (e) => {
    setOpenDropdown(false)
    setIsHover(false)
  }

  const handleClickDropdown = (e) => {
    setOpenDropdown(!openDropdown)
  }

  const readNotification = async () => {
    notificationApi
      .readNotification(item[notificationId])
      .then((res) => {
        dispatch(
          handleReadNotification({
            listNotificationRead: res.data?.list_notification_read,
            numberNotificationRead: res.data?.number_notification_read
          })
        )

        if (_.isFunction(setNotificationData)) {
          setNotificationData({
            ...item,
            read: true
          })
        }
      })
      .catch((err) => {
      })
  }

  const handleClickMarkAsRead = (e) => {
    e.preventDefault()
    readNotification()
  }

  const handleClickRemoveNotification = (e) => {
    e.preventDefault()

    notificationApi
      .removeNotification(item[notificationId])
      .then((res) => {
        dispatch(
          handleRemoveNotification({
            idField: notificationId,
            data: {
              [notificationId]: res.data.notification_remove
            }
          })
        )

        if (_.isFunction(setNotificationData)) {
          setNotificationData(
            {
              [notificationId]: res.data.notification_remove
            },
            "remove"
          )
        }
      })
      .catch((err) => {})
  }

  // ** render
  const renderContent = (str, type) => {
    if (str.trim().length === 0) {
      return ""
    }

    const newStr = handleFormatMessageStr(str)

    if (type === "title") {
      return checkHTMLTag(newStr) ? (
        <span dangerouslySetInnerHTML={{ __html: newStr }}></span>
      ) : (
        <Fragment>{newStr}</Fragment>
      )
    } else if (type === "content") {
      return checkHTMLTag(newStr) ? (
        <p
          dangerouslySetInnerHTML={{ __html: newStr }}
          className="div-content-notification"></p>
      ) : (
        <p className="div-content-notification">{newStr}</p>
      )
    }
  }

  const renderTitle = (item) => {
    if (item?.title === undefined || item.title.trim().length === 0) {
      return ""
    }

    return <Fragment>{renderContent(item.title, "title")}</Fragment>
  }

  const renderReadStatus = () => {
    if (!item.read) {
      return <div className="un-read"></div>
    }

    return ""
  }

  const renderNotificationAction = () => {
    if (!showDropdownAction) {
      return ""
    }

    let items = [
      {
        key: "mark_as_read",
        label: (
          <div
            className="d-flex align-items-center"
            onClick={(e) => handleClickMarkAsRead(e)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M3 12L7.66118 17L17 7"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 12L10.9941 17L21 7"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mb-0 text-dropdown">
              {useFormatMessage("modules.notification.buttons.mark_as_read")}
            </p>
          </div>
        )
      },
      {
        key: "remove_notification",
        label: (
          <div
            className="d-flex align-items-center"
            onClick={(e) => handleClickRemoveNotification(e)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M9.8 4.7561H14.2C14.2 3.57071 13.215 2.60976 12 2.60976C10.785 2.60976 9.8 3.57071 9.8 4.7561ZM8.15 4.7561C8.15 2.68166 9.8737 1 12 1C14.1263 1 15.85 2.68166 15.85 4.7561H22.175C22.6306 4.7561 23 5.11645 23 5.56098C23 6.0055 22.6306 6.36585 22.175 6.36585H20.724L19.4348 19.3633C19.2301 21.4261 17.4532 23 15.3289 23H8.67106C6.54679 23 4.76986 21.4261 4.56524 19.3633L3.27598 6.36585H1.825C1.36937 6.36585 1 6.0055 1 5.56098C1 5.11645 1.36937 4.7561 1.825 4.7561H8.15ZM10.35 9.85366C10.35 9.40914 9.98063 9.04878 9.525 9.04878C9.06937 9.04878 8.7 9.40914 8.7 9.85366V17.9024C8.7 18.347 9.06937 18.7073 9.525 18.7073C9.98063 18.7073 10.35 18.347 10.35 17.9024V9.85366ZM14.475 9.04878C14.9306 9.04878 15.3 9.40914 15.3 9.85366V17.9024C15.3 18.347 14.9306 18.7073 14.475 18.7073C14.0194 18.7073 13.65 18.347 13.65 17.9024V9.85366C13.65 9.40914 14.0194 9.04878 14.475 9.04878ZM6.20757 19.2082C6.33034 20.4459 7.3965 21.3902 8.67106 21.3902H15.3289C16.6035 21.3902 17.6697 20.4459 17.7924 19.2082L19.0663 6.36585H4.93369L6.20757 19.2082Z"
                fill="#696760"
              />
            </svg>
            <p className="mb-0 text-dropdown">
              {useFormatMessage(
                "modules.notification.buttons.remove_this_notification"
              )}
            </p>
          </div>
        )
      },
      ...itemsDropDown
    ]

    if (item.read) {
      items = items.filter((item) => {
        return item.key !== "mark_as_read"
      })
    }

    return (
      <Dropdown
        open={openDropdown}
        menu={{
          items
        }}
        placement="bottomRight"
        overlayClassName="dropdown-notification-action"
        onClick={(e) => handleClickDropdown(e)}>
        <Button.Ripple
          className="btn-icon btn-notification-action"
          onClick={(e) => handleClickNotificationAction(e)}>
          <i className="fas fa-ellipsis-h" />
        </Button.Ripple>
      </Dropdown>
    )
  }

  return (
    <div
      className={classnames(" div-noti app-notifications", {
        hover: isHover,
        "bg-active": !item.seen,
        "link-notification-list-notification": notificationLink.length > 0
      })}
      onMouseLeave={(e) => handleMouseLeave(e)}>
      <div className="d-flex align-items-center justify-content-between">
        <div
          className="d-flex align-items-center w-75"
          onClick={() => handleClickNotification()}>
          <div className="div-img">
            <img
              src={item.icon ?? getDefaultFridayLogo("icon")}
              className={classnames("img", {
                custom: item.icon !== null
              })}
              width={48}
            />
          </div>
          <div
            className={classnames("div-text", {
              "has-content": item.body
            })}>
            <div>
              <Fragment>{renderContent(item.body, "content")}</Fragment>
              {item.created_at && (
                <p className="div-time">{timeDifference(item.created_at)}</p>
              )}
            </div>
            <div>
              <NotificationAction
                notificationInfo={item}
                toggleOpen={toggleOpen}
              />
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-end w-25 right-content">
          <Fragment>{renderNotificationAction()}</Fragment>
          <Fragment>{renderReadStatus()}</Fragment>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
