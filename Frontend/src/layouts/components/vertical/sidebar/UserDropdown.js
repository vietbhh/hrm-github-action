// ** React Imports
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"

// ** Custom Components
//import Avatar from '@components/avatar'
// ** Utils
import { isUserLoggedIn } from "@utils"
import { Fragment, useContext, useEffect, useState } from "react"
import { Airplay, HelpCircle, Lock, Power, User } from "react-feather"

// ** Store & Actions
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

// ** Third Party Components
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap"
import { handleLogout } from "redux/authentication"
import SocketContext from "utility/context/Socket"
import ChangePasswordModal from "./ChangePasswordModal"
import classNames from "classnames"

const UserDropdown = ({
  toogleCustomizer,
  saveQuickAccess,
  settingPermits,
  menuHover,
  menuCollapsed,
  windowWidth,
  windowWidthMin,
  userId,
  notMenuCollapsed
}) => {
  // ** Store Vars
  const dispatch = useDispatch()
  const socket = useContext(SocketContext)
  // ** State
  const [userData, setUserData] = useState(null)
  const [changePwdModal, setchangePwdModal] = useState(false)
  const tooglePasswdModal = () => setchangePwdModal(!changePwdModal)
  const [openDropdownUser, setOpenDropdownUser] = useState(false)

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")))
    }
  }, [])

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar
  const sidebarCollapsed =
    !menuHover &&
    menuCollapsed === true &&
    windowWidth >= windowWidthMin &&
    !notMenuCollapsed

  useEffect(() => {
    if (sidebarCollapsed) {
      setOpenDropdownUser(false)
    }
  }, [sidebarCollapsed])

  return (
    <Fragment>
      <UncontrolledDropdown
        isOpen={openDropdownUser}
        toggle={() => setOpenDropdownUser(!openDropdownUser)}
        className={classNames("dropdown-user nav-item", {
          "hide-div": sidebarCollapsed
        })}>
        <DropdownToggle
          href="/"
          tag="a"
          className="nav-link dropdown-user-link"
          onClick={(e) => e.preventDefault()}>
          <Avatar
            src={userAvatar}
            imgHeight="40"
            imgWidth="40"
            userId={userId}
          />
          {!sidebarCollapsed && (
            <>
              <div className="user-nav d-flex">
                <span className="user-name fw-bold">
                  {userData && userData.full_name}
                </span>
                <span className="user-status">
                  @{userData && userData.username}
                </span>
              </div>

              <svg
                className="ms-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none">
                <path
                  d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z"
                  stroke="#585858"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.83334 11.8067V10.1933C1.83334 9.24 2.61251 8.45167 3.57501 8.45167C5.23418 8.45167 5.91251 7.27833 5.07834 5.83916C4.60168 5.01416 4.88584 3.94166 5.72001 3.465L7.30584 2.5575C8.03001 2.12666 8.96501 2.38333 9.39584 3.1075L9.49668 3.28166C10.3217 4.72083 11.6783 4.72083 12.5125 3.28166L12.6133 3.1075C13.0442 2.38333 13.9792 2.12666 14.7033 2.5575L16.2892 3.465C17.1233 3.94166 17.4075 5.01416 16.9308 5.83916C16.0967 7.27833 16.775 8.45167 18.4342 8.45167C19.3875 8.45167 20.1758 9.23083 20.1758 10.1933V11.8067C20.1758 12.76 19.3967 13.5483 18.4342 13.5483C16.775 13.5483 16.0967 14.7217 16.9308 16.1608C17.4075 16.995 17.1233 18.0583 16.2892 18.535L14.7033 19.4425C13.9792 19.8733 13.0442 19.6167 12.6133 18.8925L12.5125 18.7183C11.6875 17.2792 10.3308 17.2792 9.49668 18.7183L9.39584 18.8925C8.96501 19.6167 8.03001 19.8733 7.30584 19.4425L5.72001 18.535C4.88584 18.0583 4.60168 16.9858 5.07834 16.1608C5.91251 14.7217 5.23418 13.5483 3.57501 13.5483C2.61251 13.5483 1.83334 12.76 1.83334 11.8067Z"
                  stroke="#585858"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem
            tag={Link}
            to="/profile"
            onClick={() => {
              if (_.isFunction(saveQuickAccess)) {
                saveQuickAccess("/profile")
              }
            }}>
            <User size={14} className="me-75" />
            <span className="align-middle">
              {useFormatMessage("app.profile")}
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => tooglePasswdModal()}>
            <Lock size={14} className="me-75" />
            <span className="align-middle">
              {useFormatMessage("app.changePassword")}
            </span>
          </DropdownItem>

          <DropdownItem divider />

          <DropdownItem onClick={() => toogleCustomizer()}>
            <Airplay
              size={14}
              className="me-75"
              data-tour={useFormatMessage("app.appearance")}
            />
            <span className="align-middle">
              {useFormatMessage("app.appearance")}
            </span>
          </DropdownItem>
          <DropdownItem tag={Link} to="/faq">
            <HelpCircle size={14} className="me-75" />
            <span className="align-middle">FAQ</span>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              dispatch(handleLogout())
              if (socket.connected) {
                socket.close()
              }
            }}>
            <Power size={14} className="me-75" />
            <span className="align-middle">
              {useFormatMessage("auth.logout")}
            </span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>

      <ChangePasswordModal
        modal={changePwdModal}
        handleModal={tooglePasswdModal}
      />
    </Fragment>
  )
}

export default UserDropdown
