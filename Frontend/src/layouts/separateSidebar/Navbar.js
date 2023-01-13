// ** Third Party Components
import classNames from "classnames"
import { NavLink } from "react-router-dom"

// ** Reactstrap Imports
import * as Icon from "react-feather"
import { Navbar } from "reactstrap"

// ** Custom Components
import Logo from "@apps/modules/download/pages/Logo"
import NavbarBookmarks from "layouts/components/vertical/navbar/NavbarBookmarks"
import NavbarUser from "layouts/components/vertical/navbar/NavbarUser"
import { useSelector } from "react-redux"

const NavbarComponent = (props) => {
  const {
    skin,
    setSkin,
    setMenuVisibility,
    windowWidth,
    windowWidthMin,
    full_name,
    saveQuickAccess,
    defaultMenuNav,
    settingPermits
  } = props

  const logoDefault = useSelector((state) => state.layout.logo_default)
  const logoSmall = useSelector((state) => state.layout.logo_white)
  const customSettingMenu =
    useSelector((state) => state.auth.settings).top_menu_config || {}

  return (
    <Navbar
      expand="lg"
      container={false}
      light={true}
      className={classNames(`header-navbar navbar`, {})}>
      <div className="navbar-container d-flex align-items-center">
        {windowWidth >= windowWidthMin && (
          <div className="navbar-logo">
            <NavLink
              to="/"
              className="navbar-brand"
              onClick={(e) => {
                if (windowWidth < windowWidthMin) {
                  e.preventDefault()
                  setMenuVisibility(true)
                }
              }}>
              <span className="logo-default d-none d-sm-block">
                <Logo src={logoDefault} alt="logo" />
              </span>
              <span className="logo-small d-sm-none">
                <Logo
                  src={logoSmall}
                  alt="logo"
                  logoType="small"
                  loading="true"
                />
              </span>
            </NavLink>
          </div>
        )}

        {windowWidth < windowWidthMin && (
          <NavLink
            className="nav-menu-main menu-toggle hidden-xs"
            style={{ color: "#32434F" }}
            to={"#"}
            onClick={(e) => {
              e.preventDefault()
              setMenuVisibility(true)
            }}>
            <Icon.Menu className="ficon" />
          </NavLink>
        )}

        <div className="bookmark-wrapper d-flex align-items-center">
          <NavbarBookmarks
            windowWidth={windowWidth}
            windowWidthMin={windowWidthMin}
            full_name={full_name}
            hideIconVisibility={true}
          />
        </div>

        <NavbarUser
          customSettingMenu={customSettingMenu}
          defaultMenuNav={defaultMenuNav}
          settingPermits={settingPermits}
        />
      </div>
    </Navbar>
  )
}

export default NavbarComponent
