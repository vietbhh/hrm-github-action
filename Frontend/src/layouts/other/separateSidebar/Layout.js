// ** React Imports
import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

// ** Third Party Components
import { useFormatMessage } from "@apps/utility/common"
import classNames from "classnames"
import { ArrowUp } from "react-feather"
import { NavLink, useLocation } from "react-router-dom"

// ** Reactstrap Imports
import { Button, Col, Navbar, Row } from "reactstrap"

// ** Custom Components
import ScrollToTop from "@components/scrolltop"
import Logo from "@apps/modules/download/pages/Logo"
import NavbarBookmarks from "layouts/components/vertical/navbar/NavbarBookmarks"
import NavbarUser from "layouts/components/vertical/navbar/NavbarUser"
import settingMenu from "navigation/settingMenu"
import Sidebar from "./components/Sidebar"
import Customizer from "layouts/components/vertical/sidebar/customizer"

// ** Custom Hooks
import { useFooterType } from "@hooks/useFooterType"
import { useLayout } from "@hooks/useLayout"
import { useNavbarColor } from "@hooks/useNavbarColor"
import { useNavbarType } from "@hooks/useNavbarType"
import { useSkin } from "@hooks/useSkin"
import { AbilityContext } from "utility/context/Can"

// ** Configs
import themeConfig from "@configs/themeConfig"

// ** Styles
import "./assets/scss/layout.scss"

const Layout = (props) => {
  // ** Props
  const { children, className, menuData } = props

  const dispatch = useDispatch()
  const layoutStore = useSelector((state) => state.layout)
  const logoDefault = useSelector((state) => state.layout.logo_default)
  const logoSmall = useSelector((state) => state.layout.logo_white)
  const auth = useSelector((state) => state.auth)
  const userData = auth.userData
  const full_name = userData.full_name
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const windowWidthMin = 1200

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }
  //** Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener("resize", handleWindowWidth)
    }
  }, [windowWidth])

  // ** Hooks
  const { skin, setSkin } = useSkin()
  const { navbarType, setNavbarType } = useNavbarType()
  const { footerType, setFooterType } = useFooterType()
  const { navbarColor, setNavbarColor } = useNavbarColor()
  const { layout, setLayout, setLastLayout } = useLayout()
  const location = useLocation()
  const isHidden = layoutStore.menuHidden
  const contentWidth = layoutStore.contentWidth

  //**For Customizer */
  const [customizer, setCustomizer] = useState(false)
  const toogleCustomizer = () => setCustomizer(!customizer)

  // ** Handles Content Width
  const setIsHidden = (val) => dispatch(handleMenuHidden(val))

  //** Friday */
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

  return (
    <div
      className={classNames(
        `wrapper homepage-layout ${className ? className : ""}`,
        {}
      )}>
      <Navbar
        expand="lg"
        container={false}
        light={true}
        className={classNames(`header-navbar navbar`, {})}>
        <div className="navbar-container d-flex align-items-center">
          <div className="navbar-logo">
            <NavLink to="/" className="navbar-brand">
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

      <Sidebar
        menuData={menuData}
        windowWidth={windowWidth}
        windowWidthMin={windowWidthMin}
        toogleCustomizer={toogleCustomizer}
        settingPermits={settingPermits}
      />

      {children}

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
