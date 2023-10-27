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
import { handleLogout } from "@store/authentication"
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
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 17.1101V22.8801C11 25.0001 11 25.0001 13 26.3501L18.5 29.5301C19.33 30.0101 20.68 30.0101 21.5 29.5301L27 26.3501C29 25.0001 29 25.0001 29 22.8901V17.1101C29 15.0001 29 15.0001 27 13.6501L21.5 10.4701C20.68 9.99011 19.33 9.99011 18.5 10.4701L13 13.6501C11 15.0001 11 15.0001 11 17.1101Z"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 23C21.6569 23 23 21.6569 23 20C23 18.3431 21.6569 17 20 17C18.3431 17 17 18.3431 17 20C17 21.6569 18.3431 23 20 23Z"
                  stroke="#696760"
                  strokeWWidth="1.5"
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
