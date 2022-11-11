// ** React Imports
import { Fragment } from "react"
import { NavLink as Link } from "react-router-dom"

// ** Third Party Components
import * as Icon from "react-feather"

// ** Custom Component

// ** Reactstrap Imports
import { NavItem, NavLink, UncontrolledTooltip } from "reactstrap"

// ** Store & Actions
import { useSelector } from "react-redux"

const NavbarBookmarks = (props) => {
  // ** Props
  const { setMenuVisibility } = props

  // ** Store Vars
  const customTopMenu =
    useSelector((state) => state.auth.settings).top_menu || []

  const defaultMenu = [
    {
      id: "dashboard",
      target: "dashboard",
      title: "Dashboard",
      icon: "iconly-Home icli",
      link: "/dashboard"
    },
    {
      id: "calendar",
      target: "calendar",
      title: "Calendar",
      icon: "iconly-Calendar icli",
      link: "/calendar"
    }
  ]
  // ** Loops through Bookmarks Array to return Bookmarks
  const renderBookmarks = () => {
    const menu = [...defaultMenu, ...customTopMenu]
    if (menu) {
      return menu
        .map((item) => {
          return (
            <NavItem key={item.target} className="d-none d-lg-block">
              <NavLink tag={Link} to={item.link} id={item.target}>
                <i className={item.icon}></i>
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
    <Fragment>
      <ul className="navbar-nav d-xl-none">
        <NavItem className="mobile-menu me-auto">
          <NavLink
            className="nav-menu-main menu-toggle hidden-xs is-active"
            onClick={() => setMenuVisibility(true)}>
            <Icon.Menu className="ficon" />
          </NavLink>
        </NavItem>
      </ul>
      <ul className="nav navbar-nav bookmark-icons">{renderBookmarks()}</ul>
    </Fragment>
  )
}

export default NavbarBookmarks
