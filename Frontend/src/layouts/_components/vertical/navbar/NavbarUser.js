// ** Third Party Components
import { Fragment, useContext } from "react"
import { NavLink as Link } from "react-router-dom"
import { AbilityContext } from "utility/context/Can"
import NavbarChat from "./NavbarChat"
import NavbarInbox from "./NavbarInbox"
import NavbarSearch from "../../navbar/NavbarSearch"
import NotificationDropdown from "./NotificationDropdown"
import AppDrawer from "../../navbar/AppDrawer"
// ** Reactstrap Imports
import {
  NavItem,
  NavLink,
  UncontrolledTooltip,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap"

// ** Store & Actions
import { useSelector } from "react-redux"
import { useFormatMessage } from "@apps/utility/common"

const NavbarUser = (props) => {
  // ** Props
  const { saveQuickAccess, defaultMenuNav, settingPermits, removeSearch } =
    props

  // ** Store Vars
  const ability = useContext(AbilityContext)
  const customTopMenu =
    useSelector((state) => state.auth.settings).top_menu || {}

  // ** Loops through Bookmarks Array to return Bookmarks
  const renderBookmarks = () => {
    const listMenu = { ...defaultMenuNav, ...customTopMenu }
    const menu = _.orderBy(
      _.map(
        _.filter(
          listMenu,
          (item) => ability.can(item.action, item.resource) && !item.hide
        ),
        (item) => item
      ),
      ["order", "asc"]
    )
    if (menu) {
      return menu
        .map((item) => {
          if (item.id === "message") {
            return <NavbarInbox key={item.target} />
          }
          if (item.id === "chat") {
            return <NavbarChat key={item.target} />
          }
          if (item.id === "notification") {
            return <NotificationDropdown key={item.target} />
          }
          return (
            <NavItem key={item.target} className="">
              <NavLink
                tag={Link}
                to={item.link}
                id={item.target}
                onClick={() => {
                  if (_.isFunction(saveQuickAccess)) {
                    saveQuickAccess(item.link)
                  }
                }}>
                {item.icon}
                <UncontrolledTooltip target={item.target}>
                  {item.title}
                </UncontrolledTooltip>
              </NavLink>
            </NavItem>
          )
        })
        .slice(0, 10)
    } else {
      return null
    }
  }

  return (
    <ul className="nav navbar-nav align-items-center ms-auto">
      <NavbarSearch
        checkLayout="vertical"
        saveQuickAccess={saveQuickAccess}
        removeSearch={removeSearch}
      />
      <AppDrawer />
      {renderBookmarks()}
      {!_.isEmpty(settingPermits) && (
        <UncontrolledDropdown
          tag="li"
          className="dropdown-notification nav-item dropdown-setting">
          <DropdownToggle
            tag="a"
            data-toggle="dropdown"
            className="nav-link"
            href="/"
            onClick={(e) => e.preventDefault()}
            id="setting">
            <i className="fa-regular fa-gear bell"></i>
          </DropdownToggle>
          <DropdownMenu tag="ul" end className="dropdown-menu-media mt-0">
            {_.map(settingPermits, (item, index) => (
              <Fragment key={index}>
                {item.dividerBefore && <DropdownItem divider />}
                <DropdownItem
                  key={item.id}
                  tag={Link}
                  to={item.navLink}
                  onClick={() => {
                    if (_.isFunction(saveQuickAccess)) {
                      saveQuickAccess(item.navLink)
                    }
                  }}>
                  <i className={`${item.icon} me-75`}></i>
                  <span className="align-middle">
                    {useFormatMessage(item.title)}
                  </span>
                </DropdownItem>
                {item.dividerAfter && <DropdownItem divider />}
              </Fragment>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </ul>
  )
}
export default NavbarUser
