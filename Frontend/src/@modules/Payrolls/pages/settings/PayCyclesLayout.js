import { useFormatMessage } from "@apps/utility/common"
import "@styles/react/apps/app-todo.scss"
import React, { useEffect, useState } from "react"
import { NavLink as RRNavLink } from "react-router-dom"
import { Card, CardBody, Nav, NavItem, NavLink, Row } from "reactstrap"
const PayCyclesLayout = (props) => {
  const pathname = window.location.pathname
  const [windowWidth, setWindowWidth] = useState(null)
  const { state, setState, loadData, metas, options, module } = props

  useEffect(() => {
    if (window !== undefined) {
      setWindowWidth(window.innerWidth)
      window.addEventListener("resize", setWindowWidth(window.innerWidth))
    }
  }, [])

  const settingMenu = [
    {
      id: "general",
      title: useFormatMessage("modules.pay_cycles.text.general"),
      type: "item",
      action: "add",
      resource: "General",
      icon: "fal fa-exclamation-circle",
      moduleName: "pay_cycles",
      navLink: ["/payrolls/settings/general"]
    },
    {
      id: "paycycles",
      title: useFormatMessage("modules.pay_cycles.text.pay_cycles"),
      type: "item",
      action: "add",
      resource: "paycycles",
      icon: "fal fal fa-sync",
      moduleName: "pay_cycles",
      navLink: ["/payrolls/settings/pay-cycles"]
    },
    {
      id: "compensation",
      title: useFormatMessage("modules.pay_cycles.text.compensation"),
      type: "item",
      action: "add",
      resource: "paycycles",
      icon: "fal fa-recycle",
      moduleName: "pay_cyles",
      navLink: ["/payrolls/settings/compensation"]
    }
  ]
  const renderMenu = () => {
    return settingMenu.map((menu) => {
      const icon = menu.icon
      return (
        <NavItem key={menu.id}>
          <NavLink
            exact={"true"}
            to={menu.navLink.shift()}
            tag={RRNavLink}
            active={menu.navLink.includes(pathname)}>
            <i className={`${icon}`}></i>
            <span className="d-md-inline-block d-none align-middle ms-1">
              {menu.title}
            </span>
          </NavLink>
        </NavItem>
      )
    })
  }

  return (
    <React.Fragment>
      {props.breadcrumbs}
      <Card className="extraWidthLayoutPage">
        <CardBody className="p-md-0 pay-cycles">
          <Row className="contentWrapper">
            <div
              className={`col-sm-12 col-md-3 sideBarColumn ${
                windowWidth >= 769 ? "nav-vertical" : ""
              }`}>
              <h1 className="box-title">
                {useFormatMessage("modules.pay_cycles.text.settings")}
              </h1>
              <Nav className="module-menu nav-left w-100" tabs>
                {renderMenu()}
              </Nav>
            </div>
            <div className="col-sm-12 col-md-9 mainContent">
              {props.children}
            </div>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}
export default PayCyclesLayout
