// ** Third Party Components
import { useContext } from "react"
import { NavLink as Link } from "react-router-dom"
import { AbilityContext } from "utility/context/Can"
import AppDrawer from "../../navbar/AppDrawer"
import NavbarSearch from "../../navbar/NavbarSearch"
import NavbarChat from "./NavbarChat"
import NavbarInbox from "./NavbarInbox"
import NotificationDropdown from "./NotificationDropdown"
// ** Reactstrap Imports
import { NavItem, NavLink, UncontrolledTooltip } from "reactstrap"

// ** Store & Actions
import { useSelector } from "react-redux"

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
      {renderBookmarks()}

      {/* <UncontrolledDropdown
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
        </UncontrolledDropdown> */}
      {!_.isEmpty(settingPermits) && (
        <li className="nav-item">
          <Link to="/settings/general" className="nav-link" id="setting">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none">
              <path
                d="M12 15.5C13.6569 15.5 15 14.1569 15 12.5C15 10.8431 13.6569 9.5 12 9.5C10.3431 9.5 9 10.8431 9 12.5C9 14.1569 10.3431 15.5 12 15.5Z"
                stroke="#696760"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 13.3801V11.6201C2 10.5801 2.85 9.72006 3.9 9.72006C5.71 9.72006 6.45 8.44006 5.54 6.87006C5.02 5.97006 5.33 4.80006 6.24 4.28006L7.97 3.29006C8.76 2.82006 9.78 3.10006 10.25 3.89006L10.36 4.08006C11.26 5.65006 12.74 5.65006 13.65 4.08006L13.76 3.89006C14.23 3.10006 15.25 2.82006 16.04 3.29006L17.77 4.28006C18.68 4.80006 18.99 5.97006 18.47 6.87006C17.56 8.44006 18.3 9.72006 20.11 9.72006C21.15 9.72006 22.01 10.5701 22.01 11.6201V13.3801C22.01 14.4201 21.16 15.2801 20.11 15.2801C18.3 15.2801 17.56 16.5601 18.47 18.1301C18.99 19.0401 18.68 20.2001 17.77 20.7201L16.04 21.7101C15.25 22.1801 14.23 21.9001 13.76 21.1101L13.65 20.9201C12.75 19.3501 11.27 19.3501 10.36 20.9201L10.25 21.1101C9.78 21.9001 8.76 22.1801 7.97 21.7101L6.24 20.7201C5.33 20.2001 5.02 19.0301 5.54 18.1301C6.45 16.5601 5.71 15.2801 3.9 15.2801C2.85 15.2801 2 14.4201 2 13.3801Z"
                stroke="#696760"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </li>
      )}
      <AppDrawer />
    </ul>
  )
}
export default NavbarUser
