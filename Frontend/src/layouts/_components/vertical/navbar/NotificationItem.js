// ** React Imports
import {
  checkHTMLTag,
  handleFormatMessageStr
} from "layouts/_components/vertical/common/common"
import { Fragment } from "react"
import classnames from "classnames"
import { useNavigate } from "react-router-dom"
import { getDefaultFridayLogo, timeDifference } from "@apps/utility/common"
// ** redux
import { toggleOpenDropdown } from "@store/notification"
import { useDispatch } from "react-redux"
// ** Styles
// ** Components
import NotificationAction from "./NotificationAction"

const NotificationItem = (props) => {
  const {
    // ** props
    item
    // ** methods
  } = props

  const notificationLink = item.link.trim()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClickNotification = (notificationLink) => {
    if (notificationLink.length > 0) {
      dispatch(toggleOpenDropdown(false))
      navigate(notificationLink)
    }
  }

  // ** render
  const renderContent = (str, type) => {
    if (str.trim().length === 0) {
      return ""
    }

    const newStr = handleFormatMessageStr(str)

    if (type === "title") {
      return checkHTMLTag(str) ? (
        <span dangerouslySetInnerHTML={{ __html: str }}></span>
      ) : (
        <Fragment>{str}</Fragment>
      )
    } else if (type === "content") {
      return checkHTMLTag(newStr) ? (
        <p
          dangerouslySetInnerHTML={{ __html: newStr }}
          className="div-content"></p>
      ) : (
        <p>{newStr}</p>
      )
    }
  }

  return (
    <div
      className={classnames(" div-noti app-notifications", {
        "bg-active": !item.seen,
        "link-notification-list-notification": notificationLink.length > 0
      })}
      onClick={() => handleClickNotification(notificationLink)}>
      <div className="d-flex align-items-start">
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
            {renderContent(item.title, "title")}
            {renderContent(item.body, "content")}
            {item.created_at && (
              <p className="div-time">{timeDifference(item.created_at)}</p>
            )}
          </div>
          <div>
            <NotificationAction notificationInfo={item} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
