// ** React Imports
import {
  checkHTMLTag,
  handleFormatMessageStr
} from "layouts/_components/vertical/common/common"
import { Fragment } from "react"
import classnames from "classnames"
import { useNavigate } from "react-router-dom"
import { getDefaultFridayLogo, timeDifference } from "@apps/utility/common"
// ** Styles
// ** Components
import NotificationAction from "./NotificationAction"

const NotificationItem = (props) => {
  const {
    // ** props
    item,
    // ** methods
    toggleOpen
  } = props

  const notificationLink = item.link.trim()

  const navigate = useNavigate()

  const handleClickNotification = (notificationLink) => {
    if (notificationLink.length > 0) {
      toggleOpen(false)
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
      return checkHTMLTag(newStr) ? (
        <span dangerouslySetInnerHTML={{ __html: newStr }}></span>
      ) : (
        <Fragment>{newStr}</Fragment>
      )
    } else if (type === "content") {
      return checkHTMLTag(newStr) ? (
        <p
          dangerouslySetInnerHTML={{ __html: newStr }}
          className="div-content"></p>
      ) : (
        <p className="div-content">{newStr}</p>
      )
    }
  }

  const renderTitle = (item) => {
    if (item?.title === undefined || item.title.trim().length === 0) {
      return ""
    }

    return <Fragment>{renderContent(item.title, "title")}</Fragment>
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
            <Fragment>{renderTitle(item)}</Fragment>
            <Fragment>{renderContent(item.body, "content")}</Fragment>
            {item.created_at && (
              <p className="div-time">{timeDifference(item.created_at)}</p>
            )}
          </div>
          <div>
            <NotificationAction notificationInfo={item} toggleOpen={toggleOpen}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
