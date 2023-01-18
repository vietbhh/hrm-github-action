// ** React Imports
import classnames from "classnames"
import moment from "moment"
import { Fragment } from "react"
import { Link } from "react-router-dom"
// ** Styles
import { Badge } from "reactstrap"
// ** Components
import { getDefaultFridayLogo, timeDifference } from "@apps/utility/common"

const ListNotification = (props) => {
  const {
    // ** props
    listNotification
    // ** methods
  } = props

  // ** render
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
    let duration = moment
      .duration(moment().diff(moment(item.created_at, "YYYY/MM/DD HH:mm")))
      .asHours()
    let suffix = "h"
    if (duration > 24) {
      duration = duration / 24
      suffix = "d"
    }
    return (
      <div
        key={`notification-${index}`}
        className={classnames(
          "d-flex align-items-center div-noti app-notifications",
          {
            "bg-active": !item.seen
          }
        )}>
        <div className="div-img">
          <img
            src={item.icon ?? getDefaultFridayLogo("icon")}
            className="img"
            width={48}
          />
        </div>
        <div
          className={classnames("div-text", {
            "has-content": item.body
          })}>
          {item.title}
          {item.body && <p className="div-content">{item.body}</p>}
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
