import { useFormatMessage } from "@apps/utility/common"
import "@styles/react/apps/app-todo.scss"
import React, { useContext, useEffect, useState } from "react"
import { NavLink as RRNavLink } from "react-router-dom"
import { Card, CardBody, Nav, NavItem, NavLink, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
const TestBoardLayout = (props) => {
  const pathname = window.location.pathname
  const [windowWidth, setWindowWidth] = useState(null)
  const ability = useContext(AbilityContext)

  useEffect(() => {
    if (window !== undefined) {
      setWindowWidth(window.innerWidth)
      window.addEventListener("resize", setWindowWidth(window.innerWidth))
    }
  }, [])

  const settingMenu = [
    {
      id: "history",
      title: useFormatMessage("modules.test.text.history"),
      type: "item",
      action: "add",
      resource: "istory",
      icon: "fal fa-exclamation-circle",
      moduleName: "attendance_setting",
      navLink: ["/test/board/history"]
    },
    {
      id: "import",
      title: useFormatMessage("modules.test.text.import"),
      type: "item",
      action: "add",
      resource: "Import",
      icon: "fal fa-location",
      moduleName: "attendance_setting",
      navLink: ["/test/board/import"]
    }
  ]
  const renderMenu = () => {
    return settingMenu.map((menu) => {
      const icon = menu.icon
      if (ability.can("access_" + menu.id, menu.moduleName)) {
        return (
          <NavItem key={menu.id}>
            <NavLink
              exact="true"
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
    <React.Fragment>
      {props.breadcrumbs}
      <Card className="extraWidthLayoutPage">
        <CardBody className="p-md-0 attendance_setting">
          <Row className="contentWrapper">
            <div
              className={`col-sm-12 col-md-3 sideBarColumn ${
                windowWidth >= 769 ? "nav-vertical" : ""
              }`}>
              <h1 className="box-title">
                {useFormatMessage("modules.test.title.test_board")}
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
export default TestBoardLayout
