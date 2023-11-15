// ** React Imports
import { Fragment, useRef, useState } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useSelector } from "react-redux"
// ** Vertical Menu Components
import classNames from "classnames"

import QuickAccess from "./sidebar/QuickAccess"
import UserDropdown from "./sidebar/UserDropdown"
import VerticalNavMenuItems from "./sidebar/VerticalNavMenuItems"
import VerticalMenuHeader from "./VerticalMenuHeader"
import NavbarUser from "./navbar/NavbarUser"

const Sidebar = (props) => {
  // ** Props
  const {
    menuCollapsed,
    menuVisibility,
    menuData,
    skin,
    windowWidth,
    windowWidthMin,
    toogleCustomizer,
    saveQuickAccess,
    defaultMenuNav,
    settingPermits,
    customMenuComponent,
    outerCustomMenuComponent,
    hideQuickAccess,
    hideVerticalMenuHeader,
    userId,
    notMenuCollapsed,
    showVerticalMenuHeaderOnMobile
  } = props

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  const showMenu = windowWidth < 767.98 ? menuVisibility === true : true

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  const customSettingMenu =
    useSelector((state) => state.auth.settings).top_menu_config || {}

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    setMenuHover(true)
  }

  // ** Scroll Menu
  const scrollMenu = (container) => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.add("d-block")
      }
    } else {
      if (shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.remove("d-block")
      }
    }
  }
  return (
    <Fragment>
      {showMenu === true && (
        <div
          className={classNames(
            "main-menu menu-fixed menu-accordion menu-shadow",
            {
              expanded:
                menuHover || menuCollapsed === false || notMenuCollapsed,
              "menu-light": skin !== "semi-dark" && skin !== "dark",
              "menu-dark": skin === "semi-dark" || skin === "dark"
            }
          )}
          //onMouseEnter={onMouseEnter}
          onClick={onMouseEnter}
          onMouseLeave={() => setMenuHover(false)}>
          {/* Vertical Menu Header */}
          {(hideVerticalMenuHeader !== true ||
            (showVerticalMenuHeaderOnMobile === true &&
              windowWidth <= 767.98)) && (
            <VerticalMenuHeader
              setGroupOpen={setGroupOpen}
              menuHover={menuHover}
              {...props}
            />
          )}
          {/* Vertical Menu Header Shadow */}
          <div className="shadow-bottom" ref={shadowRef}></div>
          <div className="nav-bar-user-content d-none">
            <NavbarUser
              customSettingMenu={customSettingMenu}
              saveQuickAccess={saveQuickAccess}
              defaultMenuNav={defaultMenuNav}
              settingPermits={settingPermits}
            />
          </div>
          {/* Perfect Scrollbar */}
          <div className="main-menu-content">
            <PerfectScrollbar
              options={{ wheelPropagation: false }}
              onScrollY={(container) => scrollMenu(container)}>
              {outerCustomMenuComponent && (
                <Fragment>{outerCustomMenuComponent()}</Fragment>
              )}
              <ul className="navigation navigation-main">
                {customMenuComponent && (
                  <li className="">
                    <a
                      href=""
                      onClick={(e) => e.preventDefault()}
                      className="nav-item-component">
                      {customMenuComponent(props)}
                    </a>
                  </li>
                )}

                <VerticalNavMenuItems
                  items={menuData}
                  menuData={menuData}
                  menuHover={menuHover}
                  groupOpen={groupOpen}
                  activeItem={activeItem}
                  groupActive={groupActive}
                  setGroupOpen={setGroupOpen}
                  menuCollapsed={menuCollapsed}
                  setActiveItem={setActiveItem}
                  setGroupActive={setGroupActive}
                  currentActiveGroup={currentActiveGroup}
                  setCurrentActiveGroup={setCurrentActiveGroup}
                  saveQuickAccess={saveQuickAccess}
                />
              </ul>
            </PerfectScrollbar>
            <div className="div-sidebar-bottom">

              {hideQuickAccess !== true && (
                <>
                  <div className="div-hr">
                    <hr />
                  </div>
                  <div className="div-quick-access">
                    <QuickAccess
                      menuHover={menuHover}
                      menuCollapsed={menuCollapsed}
                      windowWidth={windowWidth}
                      windowWidthMin={windowWidthMin}
                      menuData={menuData}
                      saveQuickAccess={saveQuickAccess}
                      settingPermits={settingPermits}
                      defaultMenuNav={defaultMenuNav}
                      notMenuCollapsed={notMenuCollapsed}
                    />
                  </div>
                </>
              )}

              <div className="div-user-dropdown">
                <UserDropdown
                  toogleCustomizer={toogleCustomizer}
                  saveQuickAccess={saveQuickAccess}
                  settingPermits={settingPermits}
                  menuHover={menuHover}
                  menuCollapsed={menuCollapsed}
                  windowWidth={windowWidth}
                  windowWidthMin={windowWidthMin}
                  userId={userId}
                  notMenuCollapsed={notMenuCollapsed}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Sidebar
