// ** React Imports
import { Fragment } from "react"
import {
  getNavMenu,
  getNavMenuContract,
  getNavMenuAutoGenerateCode
} from "@modules/Employees/common/common"
import { Link as RRNavLink, useMatch, useResolvedPath } from "react-router-dom"
import classNames from "classnames"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Nav, NavItem, NavLink } from "reactstrap"
// ** Components

const NavMenuEmployeeSetting = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const navs = getNavMenu("employees/setting")
  const navsContract = getNavMenuContract("employees/setting")
  const navsAutoGenerateCode = getNavMenuAutoGenerateCode("employees/setting")

  // ** render
  const renderNavItem = (navigator) => {
    return navigator.map((menu) => {
      const icon = menu.icon
      const resolved = useResolvedPath(menu.navLink)
      const isActive = useMatch({ path: resolved.pathname, end: true })
      return (
        <NavItem key={menu.id}>
          <NavLink
            to={menu.navLink}
            tag={RRNavLink}
            className={classNames({
              active: isActive
            })}>
            <i className={`${icon}`}></i>
            <span className="d-md-inline-block d-none align-middle ms-50">
              {useFormatMessage(
                `modules.employee_setting.title.tabs.${menu.title}`
              )}
            </span>
          </NavLink>
        </NavItem>
      )
    })
  }

  return (
    <Fragment>
      <div>
        <div className="mb-2">
          <div>
            <h4 className="mb-25 ps-1">
              {useFormatMessage("modules.employee_setting.title.custom_fields")}
            </h4>
          </div>
          <div className="nav nav-vertical employeeNav">
            <Nav className="module-menu nav-left w-100 mt-1" tabs>
              {renderNavItem(navs)}
            </Nav>
          </div>
        </div>
        <div className="mb-2">
          <div>
            <h4 className="mb-25 ps-1">
              {useFormatMessage("modules.employee_setting.title.contract")}
            </h4>
          </div>
          <div className="nav nav-vertical employeeNav">
            <Nav className="module-menu nav-left w-100 mt-1" tabs>
              {renderNavItem(navsContract)}
            </Nav>
          </div>
        </div>
        <div>
          <div>
            <div>
              <h4 className="mb-1 ps-1">
                {useFormatMessage(
                  "modules.employee_setting.title.auto_generate_code"
                )}
              </h4>
            </div>
            <div className="nav nav-vertical employeeNav">
              <Nav className="module-menu nav-left w-100 mt-1" tabs>
                {renderNavItem(navsAutoGenerateCode)}
              </Nav>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default NavMenuEmployeeSetting
