// ** React Imports
import { Fragment, useContext, useState } from "react"
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap"

// ** Styles
import "@styles/react/libs/input-number/input-number.scss"
import appDrawerList from "@/configs/appDrawer"
import { AbilityContext } from "utility/context/Can"
import { useSelector } from "react-redux"
const AppDrawer = () => {
  // ** State
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const appDrawerSetting = useSelector(
    (state) => state.auth.settings.app_drawer_data
  )
  const appDrawerSettingEnable = appDrawerSetting?.enable ?? true
  const appDrawerSettingData = appDrawerSetting?.data || {}
  // ** Function to toggle Dropdown
  const toggle = () => setDropdownOpen((prevState) => !prevState)

  const appData = {
    enable: appDrawerSettingEnable,
    data: {
      ...appDrawerList,
      ...appDrawerSettingData
    }
  }

  // ** Store Vars
  const ability = useContext(AbilityContext)
  const renderAppItems = () => {
    const appDataList = _.orderBy(
      _.filter(appData.data, (item) => {
        let permission = true
        if (!item.enable) return false
        if (!_.isEmpty(item.permissions)) {
          //check permission array
          for (const permits of item.permissions) {
            const multiPermits = permits.split("&")
            let checkMultiPer = true
            for (const per of multiPermits) {
              const per_array = per.split(".")
              const resource = per_array[0]
              const action = per_array[1]
              if (!ability.can(action, resource)) {
                checkMultiPer = false
              }
            }
            permission = checkMultiPer
            if (permission) break
          }
        }
        return permission
      }),
      ["order"]
    )
    if (_.isEmpty(appDataList)) {
      return (
        <p className="m-0 p-1 text-center text-muted small">
          No apps available.
        </p>
      )
    } else {
      const total = 0

      return (
        <Fragment>
          {/* <PerfectScrollbar
            className="scrollable-container media-list"
            options={{
              wheelPropagation: false
            }}> */}
          <div className="row">
            {_.map(appDataList, (item, index) => {
              return (
                <Link
                  key={index}
                  className="col-md-4 app-drawer-item align-self-center align-items-center text-center"
                  to={item.navLink}
                  onClick={() => toggle()}>
                  <div className="app-drawer-icon">{item.icon}</div>
                  <p>{item.title}</p>
                </Link>
              )
            })}
          </div>
          {/* </PerfectScrollbar> */}
        </Fragment>
      )
    }
  }
  return appData.enable ? (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      tag="li"
      className="app-drawer-btn nav-item me-25">
      <DropdownToggle tag="a" className="nav-link position-relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none">
          <path
            d="M5 10.5H7C9 10.5 10 9.5 10 7.5V5.5C10 3.5 9 2.5 7 2.5H5C3 2.5 2 3.5 2 5.5V7.5C2 9.5 3 10.5 5 10.5Z"
            stroke="#696760"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 10.5H19C21 10.5 22 9.5 22 7.5V5.5C22 3.5 21 2.5 19 2.5H17C15 2.5 14 3.5 14 5.5V7.5C14 9.5 15 10.5 17 10.5Z"
            stroke="#696760"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 22.5H19C21 22.5 22 21.5 22 19.5V17.5C22 15.5 21 14.5 19 14.5H17C15 14.5 14 15.5 14 17.5V19.5C14 21.5 15 22.5 17 22.5Z"
            stroke="#696760"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 22.5H7C9 22.5 10 21.5 10 19.5V17.5C10 15.5 9 14.5 7 14.5H5C3 14.5 2 15.5 2 17.5V19.5C2 21.5 3 22.5 5 22.5Z"
            stroke="#696760"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </DropdownToggle>
      <DropdownMenu
        end
        tag="ul"
        className="dropdown-menu-media app-drawer-menu">
        {renderAppItems()}
      </DropdownMenu>
    </Dropdown>
  ) : (
    <Fragment></Fragment>
  )
}

export default AppDrawer
