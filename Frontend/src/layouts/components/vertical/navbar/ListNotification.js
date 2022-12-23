// ** React Imports
import { Fragment } from "react"
import moment from "moment"
import classnames from "classnames"
import { Link } from "react-router-dom"
// ** Styles
import { Badge } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { timeDifference } from "@apps/utility/common"

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
        className={classnames("d-flex align-items-center div-noti app-notifications", {
          "bg-active": !item.seen
        })}>
        <div className="div-img">
          <Avatar
            src={sender?.avatar}
            imgHeight="48"
            imgWidth="48"
            className="img"
          />
        </div>
        <div
          className={classnames("div-text", {
            "has-content": item.content
          })}>
          {item.title}
          {item.content && <p className="div-content">{item.content}</p>}
          <p className="div-time">{timeDifference(item.created_at)}</p>
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
