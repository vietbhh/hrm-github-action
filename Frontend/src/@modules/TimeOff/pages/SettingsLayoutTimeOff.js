// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment, useContext, useState } from "react"
import { Navigate, NavLink as RRNavLink } from "react-router-dom"
import { AbilityContext } from "utility/context/Can"
// ** Styles
import { Card, CardBody, Nav, NavItem, NavLink, Row } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"

const SettingsLayoutTimeOff = (props) => {
  const {
    // ** props
    //** methods
    setAddType
  } = props
  const pathname = window.location.pathname
  const [windowWidth, setWindowWidth] = useState(null)
  const ability = useContext(AbilityContext)
  const canSetting = ability.can("timeoffSettingAccess", "time-off")
  if (canSetting === false) {
    return (
      <Fragment>
        <Navigate to="/not-found" replace />
      </Fragment>
    )
  }

  const settingMenu = [
    {
      id: "holiday",
      title: useFormatMessage("modules.time_off.title.holiday"),
      type: "item",
      action: "add",
      icon: "fal fa-calendar",
      moduleName: "time-off",
      navLink: ["/time-off/setting/holidays"]
    },
    {
      id: "typeAndPolicy",
      title: useFormatMessage("modules.time_off.title.type_and_policy"),
      type: "item",
      action: "add",
      icon: "fal fa-layer-group",
      moduleName: "time-off",
      navLink: ["/time-off/setting/types"]
    }
  ]

  const handleClickMenu = () => {
    if (typeof setAddType === "function") {
      setAddType("")
    }
  }

  // ** render
  const renderMenu = () => {
    return settingMenu.map((menu) => {
      return (
        <NavItem key={menu.id} className="mt-0">
          <NavLink
            to={menu.navLink.shift()}
            tag={RRNavLink}
            active={menu.navLink.includes(pathname)}
            onClick={() => handleClickMenu()}>
            <i className={`${menu.icon}`}></i>
            <span className="d-md-inline-block d-none align-middle ms-1">
              {menu.title}
            </span>
          </NavLink>
        </NavItem>
      )
    })
  }

  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage(`modules.time_off.title.index`)
          }
        ]}
      />
    )
  }

  return (
    <Fragment>
      {renderBreadcrumb()}
      <Card className="extraWidthLayoutPage time-off-setting-page">
        <CardBody className="p-md-0 recruitment">
          <Row className="contentWrapper">
            <div
              className={`col-sm-12 col-md-3 sideBarColumn ${
                windowWidth >= 769 ? "nav-vertical" : ""
              }`}>
              <h3 className="box-title mb-4">
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
    </Fragment>
  )
}

export default SettingsLayoutTimeOff
