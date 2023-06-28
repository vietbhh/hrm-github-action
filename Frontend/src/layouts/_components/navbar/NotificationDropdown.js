// ** React Imports
import { Fragment } from "react"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components
import classnames from "classnames"
import { Bell } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Link } from "react-router-dom"
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  UncontrolledDropdown
} from "reactstrap"

const NotificationDropdown = () => {
  // ** Notification Array
  const notificationsArray = []

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false
        }}>
        {notificationsArray.map((item, index) => {
          return (
            <Link
              key={index}
              className="d-flex"
              href="/"
              onClick={(e) => e.preventDefault()}>
              <Media
                className={classnames("d-flex", {
                  "align-items-start": !item.switch,
                  "align-items-center": item.switch
                })}>
                {!item.switch ? (
                  <Fragment>
                    <Media left>
                      <Avatar
                        {...(item.img
                          ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                          : item.avatarContent
                          ? {
                              content: item.avatarContent,
                              color: item.color
                            }
                          : item.avatarIcon
                          ? {
                              icon: item.avatarIcon,
                              color: item.color
                            }
                          : null)}
                      />
                    </Media>
                    <Media body>
                      {item.title}
                      <small className="notification-text">
                        {item.subtitle}
                      </small>
                    </Media>
                  </Fragment>
                ) : (
                  <Fragment>
                    {item.title}
                    {item.switch}
                  </Fragment>
                )}
              </Media>
            </Link>
          )
        })}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */

  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25">
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}>
        <Bell size={21} />
        <Badge pill color="danger" className="badge-up">
          0
        </Badge>
      </DropdownToggle>
      <DropdownMenu tag="ul" end className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">Notifications</h4>
            <Badge tag="div" color="light-primary" pill>
              0 New
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className="dropdown-menu-footer">
          <Button.Ripple color="primary" block>
            Read all notifications
          </Button.Ripple>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
