// ** React Imports
import { Fragment, useState } from "react"

// ** Custom Components
import NavbarUser from "./NavbarUser"
import NavbarBookmarks from "./NavbarBookmarks"
import ChangePasswordModal from "./ChangePasswordModal"
import { NavItem } from "reactstrap"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Logo from "@apps/modules/download/pages/Logo"

//**For Customizer */
import { useLayout } from "@hooks/useLayout"
import { useNavbarType } from "@hooks/useNavbarType"
import { useFooterType } from "@hooks/useFooterType"
import { useNavbarColor } from "@hooks/useNavbarColor"
import Customizer from "../customizer"
import { handleMenuHidden } from "@store/layout"

const AppNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  const logo = useSelector((state) =>
    skin === "dark" ? state.layout.logo_white : state.layout.logo_default
  )

  const customSettingMenu =
    useSelector((state) => state.auth.settings).top_menu_config || {}

  const [changePwdModal, setchangePwdModal] = useState(false)
  const tooglePasswdModal = () => setchangePwdModal(!changePwdModal)

  //**For Customizer */
  const [customizer, setCustomizer] = useState(false)
  const toogleCustomizer = () => setCustomizer(!customizer)
  const { navbarType, setNavbarType } = useNavbarType()
  const { footerType, setFooterType } = useFooterType()
  const { navbarColor, setNavbarColor } = useNavbarColor()
  const { layout, setLayout, setLastLayout } = useLayout()
  const dispatch = useDispatch()
  const layoutStore = useSelector((state) => state.layout)
  const isHidden = layoutStore.menuHidden
  const setIsHidden = (val) => dispatch(handleMenuHidden(val))
  return (
    <Fragment>
      <div className="bookmark-wrapper d-flex align-items-center">
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>
      {layout === "horizontal" && (
        <div className="navbar-header d-xl-block d-none">
          <ul className="nav navbar-nav">
            <NavItem>
              <Link to="/" className="navbar-brand">
                <span className="brand-logo">
                  <Logo src={logo} alt="logo" />
                </span>
              </Link>
            </NavItem>
          </ul>
        </div>
      )}
      <NavbarUser
        toogleCustomizer={toogleCustomizer}
        skin={skin}
        setSkin={setSkin}
        tooglePasswdModal={tooglePasswdModal}
        customSettingMenu={customSettingMenu}
      />
      <ChangePasswordModal
        modal={changePwdModal}
        handleModal={tooglePasswdModal}
      />
      {customizer && (
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
        />
      )}
    </Fragment>
  )
}

export default AppNavbar
