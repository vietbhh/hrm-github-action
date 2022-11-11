// ** Dropdowns Imports
// ** Third Party Components
import { isEmpty } from "lodash"
import settingMenu from "navigation/settingMenu"
import { useContext } from "react"
import { Moon, Sun } from "react-feather"
import { AbilityContext } from "utility/context/Can"
import NavbarSearch from "./NavbarSearch"
import NotificationDropdown from "./NotificationDropdown"
import SettingDropdown from "./SettingDropdown"
import UserDropdown from "./UserDropdown"

const NavbarUser = (props) => {
  // ** Props
  const {
    skin,
    setSkin,
    toogleCustomizer,
    tooglePasswdModal,
    customSettingMenu
  } = props

  //** Friday */
  const ability = useContext(AbilityContext)
  const listSettingMenu = { ...settingMenu, ...customSettingMenu }
  const settingPermits = _.orderBy(
    _.map(
      _.filter(
        listSettingMenu,
        (item) => ability.can(item.action, item.resource) && !item.hide
      ),
      (item) => item
    ),
    ["order", "asc"]
  )
  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun className="ficon" onClick={() => setSkin("light")} />
    } else {
      return <Moon className="ficon" onClick={() => setSkin("dark")} />
    }
  }
  return (
    <ul className="nav navbar-nav align-items-center ms-auto">
      {/* <IntlDropdown />
			<NavItem className="d-none d-lg-block">
				<NavLink className="nav-link-style">
					<ThemeToggler />
				</NavLink>
			</NavItem>*/}
      {/* <QuickAddDropDown /> */}

      <NavbarSearch />
      <NotificationDropdown />
      {!isEmpty(settingPermits) && (
        <SettingDropdown settingMenu={settingPermits} />
      )}
      <UserDropdown
        toogleCustomizer={toogleCustomizer}
        tooglePasswdModal={tooglePasswdModal}
      />
    </ul>
  )
}
export default NavbarUser
