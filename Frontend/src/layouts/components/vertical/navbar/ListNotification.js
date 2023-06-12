// ** React Imports
import classnames from "classnames"
import moment from "moment"
import { Fragment } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  checkHTMLTag,
  handleFormatMessageStr
} from "@src/layouts/components/vertical/common/common"
// ** redux
import { useDispatch } from "react-redux"
import { toggleOpenDropdown } from "redux/notification"
// ** Styles
import { Badge } from "reactstrap"
// ** Components
import {
  getDefaultFridayLogo,
  timeDifference,
  useFormatMessage
} from "@apps/utility/common"


const ListNotification = (props) => {
  const {
    // ** props
    listNotification
    // ** methods
  } = props

  const navigate = useNavigate()

  const dispatch = useDispatch()

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

  const renderCategoryBadge = (category = "", color = "warning") => {
    if (category === "comment") {
      return (
        <Badge pill color={color} className="badge-up badge-up-green">
          <i className="iconly-Message icbo icon"></i>
        </Badge>
      )
    } else if (category === "chat") {
      return (
        <Badge pill color={color} className="badge-up">
          <i className="iconly-Chat icbo icon"></i>
        </Badge>
      )
    }

    return (
      <Badge pill color={color} className="badge-up badge-up-primary">
        <i className="iconly-Message icbo icon"></i>
      </Badge>
    )
  }

  const renderNotificationItem = (item, index) => {
    const sender = item.sender_id
    const notificationLink = item.link.trim()

    return (
      <div
        key={`notification-${index}`}
        className={classnames(
          "d-flex align-items-center div-noti app-notifications",
          {
            "bg-active": !item.seen,
            "link-notification-list-notification": notificationLink.length > 0
          }
        )}
        onClick={() => handleClickNotification(notificationLink)}>
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
          {renderContent(item.title, "title")}
          {renderContent(item.body, "content")}
          {item.created_at && (
            <p className="div-time">{timeDifference(item.created_at)}</p>
          )}
        </div>
      </div>
    )
  }

  const renderComponent = () => {
    return (
      <Fragment>
        {listNotification.map((item, index) => {
          if (index < 10) {
            const Wrap = item.link ? Fragment : Link
            const wrapProps = item.link ? {} : { to: item.link }
            return (
              <Wrap key={index} {...wrapProps}>
                {renderNotificationItem(item, index)}
              </Wrap>
            )
          }
        })}
      </Fragment>
    )
  }

  return renderComponent()
}

export default ListNotification
