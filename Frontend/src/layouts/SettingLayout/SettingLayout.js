// ** React Imports
import { Outlet } from "react-router-dom"
import { useFormatMessage } from "@apps/utility/common"
import { useContext } from "react"
import { useSelector } from "react-redux"
import settingMenu from "@/configs/settingMenu"
import { AbilityContext } from "utility/context/Can"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "layouts/_components/vertical/Layout"
import "./assets/scss/setting.scss"

// ** import component
import Navbar from "../SeparateSidebarLayout/Navbar"

const SettingLayout = (props) => {
  const customSettingMenu =
    useSelector((state) => state.auth.settings).top_menu_config || {}
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

  const navigation = settingPermits.map((item) => {
    if (item.type === "header") {
      return {
        header: item.title,
        header_short: item.titleShort,
        action: "login",
        resource: "app"
      }
    }

    return {
      id: item.id,
      title: useFormatMessage(item.title),
      type: "dropdown",
      action: "login",
      resource: "app",
      icon:
        item.menuIcon !== undefined ? (
          item.menuIcon
        ) : (
          <div className="menu-icon purple">
            <i className={item.icon} />
          </div>
        ),
      navLink: item.navLink
    }
  })

  return (
    <Layout
      menuData={navigation}
      navbar={(navProps) => <Navbar {...navProps} />}
      /* customMenuComponent={(customProps) => (
              <CustomMenuComponent {...customProps} />
            )} */
      className="separate-sidebar-layout"
      notMenuCollapsed={true}
      hideQuickAccess={true}
      hideVerticalMenuHeader={true}
      {...props}>
      <Outlet />
    </Layout>
  )
}

export default SettingLayout
