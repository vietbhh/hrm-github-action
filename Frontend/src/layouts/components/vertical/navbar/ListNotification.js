// ** React Imports
import { Fragment } from "react"
import moment from "moment"
import classnames from "classnames"
import { Link } from "react-router-dom"
// ** Styles
import { Badge } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

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
          "d-flex align-items-center justify-content-between div-noti",
          { "bg-active": !item.seen }
        )}>
        <div className="div-img">
          <Avatar
            src={sender?.avatar}
            imgHeight="48"
            imgWidth="48"
            className="img"
          />
          <Fragment>{renderCategoryBadge()}</Fragment>
        </div>
        <div className="div-text">
          <span className="text-title">{sender?.full_name}</span>
          <span className="text-content">
            {item.content} on{" "}
            <span className="text-content-blue">{item.title}</span>
          </span>
        </div>
        <div className="div-time">{`${Math.floor(duration)}${suffix}`}</div>
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
