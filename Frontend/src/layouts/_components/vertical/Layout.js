// ** React Imports
import { Fragment, useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

// ** Store & Actions
import {
  handleMenuCollapsed,
  handleMenuHidden,
  updateLoadingDashboard
} from "@store/layout"
import { useDispatch, useSelector } from "react-redux"

// ** Third Party Components
import { useFormatMessage } from "@apps/utility/common"
import classnames from "classnames"
import { ArrowUp } from "react-feather"

// ** Reactstrap Imports
import { Button, Navbar } from "reactstrap"

// ** Configs
import themeConfig from "@configs/themeConfig"

// ** Custom Components
import ScrollToTop from "@components/scrolltop"
import FooterComponent from "./footer"
import NavbarComponent from "./Navbar"
import Sidebar from "./Sidebar"

// ** Custom Hooks
import { useFooterType } from "@hooks/useFooterType"
import { useLayout } from "@hooks/useLayout"
import { useNavbarColor } from "@hooks/useNavbarColor"
import { useNavbarType } from "@hooks/useNavbarType"
import { useSkin } from "@hooks/useSkin"
import settingMenu from "@/configs/settingMenu"
import { AbilityContext } from "utility/context/Can"

//**For Customizer */
import { DashboardApi } from "@apps/modules/dashboard/main/common/api"
import Customizer from "./sidebar/customizer"
import { Popover, Whisper } from "rsuite"
// ** Styles
import "@styles/base/core/menu/menu-types/vertical-menu.scss"
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss"
import "./scss/vertical.scss"

const Layout = (props) => {
  // ** Props
  const {
    children,
    menuData,
    navbar,
    className,
    fixedSidebarCollapsed,
    customMenuComponent,
    outerCustomMenuComponent,
    logoLeft,
    hideQuickAccess,
    hideVerticalMenuHeader,
    notMenuCollapsed = false,
    hideSidebar = false,
    showVerticalMenuHeaderOnMobile = false
  } = props

  // ** Hooks
  const { skin, setSkin } = useSkin()
  const { navbarType, setNavbarType } = useNavbarType()
  const { footerType, setFooterType } = useFooterType()
  const { navbarColor, setNavbarColor } = useNavbarColor()
  const { layout, setLayout, setLastLayout } = useLayout()

  //**For Customizer */
  const [customizer, setCustomizer] = useState(false)
  const toogleCustomizer = () => setCustomizer(!customizer)

  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [menuVisibility, setMenuVisibility] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const windowWidthMin = 1200

  // ** Vars
  const dispatch = useDispatch()
  const layoutStore = useSelector((state) => state.layout)
  const auth = useSelector((state) => state.auth)
  const userData = auth.userData
  const full_name = userData.full_name
  const userId = userData.id

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }

  // ** Vars
  const location = useLocation()
  const isHidden = hideSidebar
  const contentWidth = layoutStore.contentWidth
  const menuCollapsed = !_.isUndefined(fixedSidebarCollapsed)
    ? fixedSidebarCollapsed
    : layoutStore.menuCollapsed

  //** Friday */
  const customSettingMenu =
    useSelector((state) => state.auth.settings).top_menu_config || {}
  const ability = useContext(AbilityContext)
  const listSettingMenu = { ...settingMenu, ...customSettingMenu }
  const settingPermits = _.orderBy(
    _.map(
      _.filter(
        listSettingMenu,
        (item) => ability.can(item.action, item.resource) && !item.hide && !item.hide && item.type !== "header"
      ),
      (item) => item
    ),
    ["order", "asc"]
  )

  // ** Toggles Menu Collapsed
  const handleUpdateLoadingDashboard = () => {
    dispatch(updateLoadingDashboard(true))
    setTimeout(() => {
      DashboardApi.getUpdateLoadingDashboard()
        .then((res) => {
          dispatch(updateLoadingDashboard(false))
        })
        .catch((err) => {
          dispatch(updateLoadingDashboard(false))
        })
    }, 300)
  }
  const setMenuCollapsed = (val) => {
    dispatch(handleMenuCollapsed(val))
    handleUpdateLoadingDashboard()
  }

  // ** Handles Content Width
  const setIsHidden = (val) => dispatch(handleMenuHidden(val))

  //** This function will detect the Route Change and will hide the menu on menu item click
  useEffect(() => {
    if (menuVisibility && windowWidth < 1200) {
      setMenuVisibility(false)
    }
  }, [location])

  //** Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener("resize", handleWindowWidth)
    }
  }, [windowWidth])

  //** ComponentDidMount
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // ** Vars
  const footerClasses = {
    static: "footer-static",
    sticky: "footer-fixed",
    hidden: "footer-hidden"
  }

  const navbarWrapperClasses = {
    floating: "navbar-floating",
    sticky: "navbar-sticky",
    static: "navbar-static",
    hidden: "navbar-hidden"
  }

  const navbarClasses = {
    floating:
      contentWidth === "boxed" ? "floating-nav container-xxl" : "floating-nav",
    sticky: "fixed-top",
    static: "navbar-static-top",
    hidden: "d-none"
  }

  const defaultMenuNav = {
    calendar: {
      id: "calendar",
      target: "calendar",
      title: useFormatMessage("layout.calendar"),
      icon: <i className="fa-regular fa-calendar bell"></i>,
      link: "/calendar",
      action: "login",
      resource: "app"
    },
    chat: {
      id: "chat",
      target: "chat",
      title: useFormatMessage("layout.chat"),
      icon: "",
      link: "/chat",
      action: "login",
      resource: "app"
    },
    notification: {
      id: "notification",
      target: "notification",
      title: useFormatMessage("layout.notification.title"),
      icon: "",
      link: "/notification",
      action: "login",
      resource: "app"
    }
  }

  const saveQuickAccess = (navLink) => {
    let quick_access = localStorage.getItem("quick_access")
    if (quick_access) {
      quick_access = JSON.parse(quick_access)
      const index = quick_access.findIndex((item) => navLink === item.navLink)
      if (index > -1) {
        const item = quick_access[index]
        quick_access.splice(index, 1, { ...item, count: item.count + 1 })
      } else {
        quick_access.push({ navLink: navLink, count: 1 })
      }
    } else {
      quick_access = [{ navLink: navLink, count: 1 }]
    }

    localStorage.setItem("quick_access", JSON.stringify(quick_access))
  }

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={classnames(
        `wrapper vertical-layout ${
          navbarWrapperClasses[navbarType] || "navbar-floating"
        } ${footerClasses[footerType] || "footer-static"} ${
          className ? className : ""
        }`,
        {
          // Modern Menu
          "vertical-menu-modern": windowWidth >= windowWidthMin,
          "menu-collapsed":
            menuCollapsed && windowWidth >= windowWidthMin && !notMenuCollapsed,
          "menu-expanded": !menuCollapsed && windowWidth > windowWidthMin,

          // Overlay Menu
          "vertical-overlay-menu": windowWidth < windowWidthMin,
          "menu-hide": !menuVisibility && windowWidth < windowWidthMin,
          "menu-open": menuVisibility && windowWidth < windowWidthMin
        }
      )}
      {...(isHidden ? { "data-col": "1-column" } : {})}>
      <Navbar
        expand="lg"
        container={false}
        light={skin !== "dark"}
        dark={skin === "dark"}
        className={classnames(
          `header-navbar navbar align-items-center ${
            navbarClasses[navbarType] || "floating-nav"
          } navbar-shadow navbar-height`,
          {
            "logo-left": logoLeft === true
          }
        )}>
        <div className="navbar-container d-flex content">
          {navbar ? (
            navbar({
              skin: skin,
              setSkin: setSkin,
              setMenuVisibility: setMenuVisibility,
              windowWidth: windowWidth,
              windowWidthMin: windowWidthMin,
              full_name: full_name,
              saveQuickAccess: saveQuickAccess,
              defaultMenuNav: defaultMenuNav,
              settingPermits: settingPermits,
              logoLeft: logoLeft
            })
          ) : (
            <NavbarComponent
              skin={skin}
              setSkin={setSkin}
              setMenuVisibility={setMenuVisibility}
              windowWidth={windowWidth}
              windowWidthMin={windowWidthMin}
              full_name={full_name}
              saveQuickAccess={saveQuickAccess}
              defaultMenuNav={defaultMenuNav}
              settingPermits={settingPermits}
              logoLeft={logoLeft}
            />
          )}
        </div>
      </Navbar>

      {/* sidebar */}
      <div className="wrapper__menu-content">
        {!hideSidebar && (
          <Sidebar
            skin={skin}
            menuData={menuData}
            menuCollapsed={menuCollapsed}
            menuVisibility={menuVisibility}
            setMenuCollapsed={setMenuCollapsed}
            setMenuVisibility={setMenuVisibility}
            windowWidth={windowWidth}
            windowWidthMin={windowWidthMin}
            toogleCustomizer={toogleCustomizer}
            saveQuickAccess={saveQuickAccess}
            defaultMenuNav={defaultMenuNav}
            settingPermits={settingPermits}
            fixedSidebarCollapsed={fixedSidebarCollapsed}
            customMenuComponent={customMenuComponent}
            outerCustomMenuComponent={outerCustomMenuComponent}
            hideQuickAccess={hideQuickAccess}
            hideVerticalMenuHeader={hideVerticalMenuHeader}
            userId={userId}
            notMenuCollapsed={notMenuCollapsed}
            showVerticalMenuHeaderOnMobile={showVerticalMenuHeaderOnMobile}
          />
        )}
        {children}
      </div>

      {/* Vertical Nav Menu Overlay */}
      <div
        className={classnames("sidenav-overlay", {
          show: menuVisibility
        })}
        onClick={() => setMenuVisibility(false)}></div>
      {/* Vertical Nav Menu Overlay */}

      <footer
        className={classnames(
          `footer footer-light ${footerClasses[footerType] || "footer-static"}`,
          {
            "d-none": footerType === "hidden"
          }
        )}>
        <FooterComponent
          footerType={footerType}
          footerClasses={footerClasses}
        />
      </footer>

      {themeConfig.layout.scrollTop === true ? (
        <div className="scroll-to-top">
          <ScrollToTop showOffset={300} className="scroll-top d-block">
            <Button className="btn-icon" color="primary">
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop>
        </div>
      ) : null}

      <Customizer
        skin={skin}
        layout={layout}
        setSkin={setSkin}
        isHidden={isHidden}
        setLayout={setLayout}
        footerType={footerType}
        navbarType={navbarType}
        setIsHidden={setIsHidden}
        navbarColor={navbarColor}
        setFooterType={setFooterType}
        setNavbarType={setNavbarType}
        setLastLayout={setLastLayout}
        setNavbarColor={setNavbarColor}
        toogleCustomizer={toogleCustomizer}
        customizer={customizer}
      />
    </div>
  )
}

export default Layout
