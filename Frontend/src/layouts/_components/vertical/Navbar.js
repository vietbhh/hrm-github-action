// ** React Imports
import { Fragment } from "react"
// ** Custom Components
import { useSelector } from "react-redux"
import NavbarBookmarks from "./navbar/NavbarBookmarks"
import NavbarUser from "./navbar/NavbarUser"
import Logo from "@apps/modules/download/pages/Logo"

//**For Customizer */

const Navbar = (props) => {
  // ** Props
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

  const customSettingMenu =
    useSelector((state) => state.auth.settings).top_menu_config || {}

  const logoDefault = useSelector((state) => state.layout.logo_default)

  return (
    <Fragment>
      <div className="logo-wrapper">
        <Logo src={logoDefault} alt="logo" className="d-none" />
      </div>
      <div className="bookmark-wrapper d-flex align-items-center">
        <NavbarBookmarks
          setMenuVisibility={setMenuVisibility}
          windowWidth={windowWidth}
          windowWidthMin={windowWidthMin}
          full_name={full_name}
          saveQuickAccess={saveQuickAccess}
        />
      </div>
      <NavbarUser
        customSettingMenu={customSettingMenu}
        saveQuickAccess={saveQuickAccess}
        defaultMenuNav={defaultMenuNav}
        settingPermits={settingPermits}
      />
    </Fragment>
  )
}

export default Navbar
