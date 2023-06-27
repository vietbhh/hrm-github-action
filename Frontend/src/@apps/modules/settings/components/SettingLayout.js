import { useFormatMessage } from "@apps/utility/common"
import settingMenu from "@/configs/settingMenu"
import React, { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { NavLink as RRNavLink } from "react-router-dom"
import { Card, CardBody, Nav, NavItem, NavLink } from "reactstrap"
import { AbilityContext } from "utility/context/Can"

const SettingLayout = (props) => {
  const [windowWidth, setWindowWidth] = useState(null)
  const ability = useContext(AbilityContext)
  useEffect(() => {
    if (window !== undefined) {
      setWindowWidth(window.innerWidth)
      window.addEventListener("resize", setWindowWidth(window.innerWidth), {
        passive: true
      })
      return () => {
        window.removeEventListener("resize", setWindowWidth(window.innerWidth))
      }
    }
  }, [])
  const customSettingMenu =
    useSelector((state) => state.auth.settings).top_menu_config || {}
  const renderMenu = () => {
    const listSettingMenu = { ...settingMenu, ...customSettingMenu }
    const settingPermits = _.orderBy(
      _.map(
        _.filter(
          listSettingMenu,
          (item) =>
            ability.can(item.action, item.resource) &&
            !item.hide &&
            !item.hideOnSetting
        ),
        (item) => item
      ),
      ["order", "asc"]
    )
    return settingPermits.map((menu) => {
      const icon = menu.icon
      return (
        <NavItem key={menu.id}>
          <NavLink to={menu.navLink} tag={RRNavLink}>
            <i className={`${icon}`}></i>
            <span className="d-md-inline-block d-none align-middle ms-1">
              {useFormatMessage(menu.title)}
            </span>
          </NavLink>
        </NavItem>
      )
    })
  }

  return (
    <React.Fragment>
      <Card>
        <CardBody className="erp-box-wrapper">
          <div className="row">
            <div
              className={`col-sm-12 col-md-2 erp-box-nav  ${
                windowWidth >= 769 ? "nav-vertical" : ""
              }`}>
              <h1 className="box-title">
                Information<span className="text-danger">.</span>
              </h1>
              <Nav
                className="module-menu nav-left nav-left-newStyle w-100"
                tabs>
                {renderMenu()}
              </Nav>
            </div>
            <div className="col-sm-12 col-md-10 erp-box-content">
              {props.children}
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}
export default SettingLayout
