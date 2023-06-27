// ** React Imports
import Logo from "@apps/modules/download/pages/Logo"
// ** Utils
import { getUserData } from "@utils"
import classNames from "classnames"
import { useEffect } from "react"
// ** Icons Imports
import { Circle, Disc, X } from "react-feather"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    skin,
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
    saveQuickAccess,
    windowWidth,
    windowWidthMin,
    fixedSidebarCollapsed
  } = props

  const logoDefault = useSelector((state) => state.layout.logo_default)
  const logoSmall = useSelector((state) => state.layout.logo_white)
  const sidebarCollapsed =
    !menuHover && menuCollapsed === true && windowWidth >= windowWidthMin

  // ** Vars
  const user = getUserData()

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!_.isUndefined(fixedSidebarCollapsed)) return ""
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item me-auto">
          <NavLink
            to="/"
            className="navbar-brand"
            onClick={() => saveQuickAccess("/dashboard")}>
            <span className="brand-logo">
              <Logo
                src={logoDefault}
                alt="logo"
                className={classNames({
                  "d-none": sidebarCollapsed
                })}
              />
              <Logo
                src={logoSmall}
                alt="logo"
                logoType="small"
                className={classNames({
                  "d-none": !sidebarCollapsed
                })}
                loading="true"
              />
            </span>
          </NavLink>
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
