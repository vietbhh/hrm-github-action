import { useFormatMessage } from "@apps/utility/common"
import { Fragment, useState } from "react"
import { NavLink as RRNavLink } from "react-router-dom"
import { Card, CardBody, Nav, NavItem, NavLink, Row } from "reactstrap"

const CheckListTemplateLayout = (props) => {
  const pathname = window.location.pathname
  const [windowWidth, setWindowWidth] = useState(null)
  const { ability } = props

  const settingMenu = [
    {
      id: "onboarding",
      title: useFormatMessage("modules.checklist.title.onboarding"),
      type: "item",
      action: "add",
      resource: "Approve",
      icon: "fal fa-check-circle",
      moduleName: "checklist",
      navLink: ["/checklist/setting/onboarding"]
    },
    {
      id: "offboarding",
      title: useFormatMessage("modules.checklist.title.offboarding"),
      type: "item",
      action: "add",
      resource: "about",
      icon: "icpega Briefcase-Portfolio",
      moduleName: "checklist",
      navLink: ["/checklist/setting/offboarding"]
    }
  ]
  const renderMenu = () => {
    return settingMenu.map((menu) => {
      const icon = menu.icon
      if (ability.can("access_" + menu.id, menu.moduleName)) {
        return (
          <NavItem key={menu.id}>
            <NavLink
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
      }
    })
  }

  return (
    <Fragment>
      {props.breadcrumbs}
      <div className="checklist-page">
        <Card className="extraWidthLayoutPage">
          <CardBody className="p-md-0 recruitment">
            <Row className="contentWrapper">
              <div
                className={`col-sm-12 col-md-3 sideBarColumn ${
                  windowWidth >= 769 ? "nav-vertical" : ""
                }`}>
                <h3 className="box-title">
                  {useFormatMessage("modules.checklist_template.title.setting")}
                </h3>
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
      </div>
    </Fragment>
  )
}

export default CheckListTemplateLayout
