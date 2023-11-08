// ** React Imports
import { Fragment } from "react"
import { Link } from "react-router-dom"
// ** redux
// ** Styles
import { Badge } from "reactstrap"
// ** Components
import NotificationItem from "./NotificationItem"

const ListNotification = (props) => {
  const {
    // ** props
    listNotification,
    showDropdownAction,
    // ** methods
    toggleOpen,
    setNotificationData
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

  const renderComponent = () => {
    return (
      <Fragment>
        {listNotification.map((item, index) => {
          if (index < 10) {
            return (
              <NotificationItem
                item={item}
                key={`notification-${index}`}
                showDropdownAction={showDropdownAction}
                toggleOpen={toggleOpen}
                setNotificationData={setNotificationData}
              />
            )
          }
        })}
      </Fragment>
    )
  }

  return renderComponent()
}

export default ListNotification
