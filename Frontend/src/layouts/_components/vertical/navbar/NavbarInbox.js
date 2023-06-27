// ** Custom Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"

// ** Third Party Components
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

const NavbarInbox = () => {
  // ** Notification Array
  const notificationsArray = []

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

  return (
    <UncontrolledDropdown tag="li" className="dropdown-notification nav-item">
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
        id="message">
        <svg
          className="bell"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.4"
            d="M17.2677 8.5611L13.0023 11.9954C12.1951 12.6282 11.0635 12.6282 10.2563 11.9954L5.95422 8.5611"
            stroke="#11142D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.88787 3H16.3158C17.6752 3.01525 18.969 3.58993 19.896 4.5902C20.823 5.59048 21.3022 6.92903 21.222 8.29412V14.822C21.3022 16.1871 20.823 17.5256 19.896 18.5259C18.969 19.5262 17.6752 20.1009 16.3158 20.1161H6.88787C3.96796 20.1161 2 17.7407 2 14.822V8.29412C2 5.37545 3.96796 3 6.88787 3Z"
            stroke="#00003B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <Badge pill color="warning" className="badge-up">
          0
        </Badge>
        <UncontrolledTooltip target="message">
          {useFormatMessage("layout.message")}
        </UncontrolledTooltip>
      </DropdownToggle>
      <DropdownMenu tag="ul" end className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">
              {useFormatMessage("layout.message")}
            </h4>
            <Badge tag="div" color="light-primary" pill>
              0 {useFormatMessage("layout.message")}
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className="dropdown-menu-footer">
          <Button.Ripple color="primary" block>
            {useFormatMessage("layout.read_all_message")}
          </Button.Ripple>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NavbarInbox
