// ** React Imports
import { Fragment, useContext, useState } from "react"
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap"

// ** Styles
import "@styles/react/libs/input-number/input-number.scss"
import appDrawerList from "navigation/appDrawer"
import { AbilityContext } from "utility/context/Can"
import { useSelector } from "react-redux"
const AppDrawer = () => {
  // ** State
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const appDrawerSetting = useSelector(
    (state) => state.auth.settings.app_drawer_data
  )
  const appDrawerSettingEnable = appDrawerSetting.enable ?? true
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
                  to={`/`}
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
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20.2258 2.16669H18.1675C15.8058 2.16669 14.56 3.41252 14.56 5.77419V7.83252C14.56 10.1942 15.8058 11.44 18.1675 11.44H20.2258C22.5875 11.44 23.8333 10.1942 23.8333 7.83252V5.77419C23.8333 3.41252 22.5875 2.16669 20.2258 2.16669Z"
            fill="#69DCA1"
          />
          <path
            d="M7.84335 14.5492H5.78502C3.41252 14.5492 2.16669 15.795 2.16669 18.1567V20.215C2.16669 22.5875 3.41252 23.8334 5.77419 23.8334H7.83252C10.1942 23.8334 11.44 22.5875 11.44 20.2259V18.1675C11.4509 15.795 10.205 14.5492 7.84335 14.5492Z"
            fill="#69DCA1"
          />
          <path
            d="M6.81419 11.4617C9.38093 11.4617 11.4617 9.38093 11.4617 6.81419C11.4617 4.24744 9.38093 2.16669 6.81419 2.16669C4.24744 2.16669 2.16669 4.24744 2.16669 6.81419C2.16669 9.38093 4.24744 11.4617 6.81419 11.4617Z"
            fill="#69DCA1"
          />
          <path
            d="M19.1858 23.8333C21.7526 23.8333 23.8333 21.7526 23.8333 19.1858C23.8333 16.6191 21.7526 14.5383 19.1858 14.5383C16.6191 14.5383 14.5383 16.6191 14.5383 19.1858C14.5383 21.7526 16.6191 23.8333 19.1858 23.8333Z"
            fill="#69DCA1"
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
