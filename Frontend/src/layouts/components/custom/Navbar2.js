// ** React Imports
import { Fragment } from "react"

// ** Custom Components
import { useSelector } from "react-redux"
import NavbarUser from "../vertical/navbar/NavbarUser"
import NavbarSearch from "../navbar/NavbarSearch"

// ** import
import "./scss/navbar2.scss"

const Navbar2 = (props) => {
  // ** Props
  const { saveQuickAccess, defaultMenuNav, settingPermits } = props

  const customSettingMenu =
    useSelector((state) => state.auth.settings).top_menu_config || {}

  return (
    <Fragment>
      <div className="navbar2-div-search">
        <NavbarSearch
          checkLayout="vertical"
          saveQuickAccess={saveQuickAccess}
          icon={
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.759 13.491 2.625 9.625 2.625C5.759 2.625 2.625 5.759 2.625 9.625C2.625 13.491 5.759 16.625 9.625 16.625Z"
                stroke="#B0B7C3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.375 18.375L14.5688 14.5687"
                stroke="#B0B7C3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          iconRight={
            <svg
              width="11"
              height="7"
              viewBox="0 0 11 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 1L5.25 5.25L9.5 1"
                stroke="#B0B7C3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>
      <NavbarUser
        customSettingMenu={customSettingMenu}
        saveQuickAccess={saveQuickAccess}
        defaultMenuNav={defaultMenuNav}
        settingPermits={settingPermits}
        removeSearch={true}
      />
    </Fragment>
  )
}

export default Navbar2
