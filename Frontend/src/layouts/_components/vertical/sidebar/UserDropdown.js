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
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M3 9.11011V14.8801C3 17.0001 3 17.0001 5 18.3501L10.5 21.5301C11.33 22.0101 12.68 22.0101 13.5 21.5301L19 18.3501C21 17.0001 21 17.0001 21 14.8901V9.11011C21 7.00011 21 7.00011 19 5.65011L13.5 2.47011C12.68 1.99011 11.33 1.99011 10.5 2.47011L5 5.65011C3 7.00011 3 7.00011 3 9.11011Z"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="#696760"
                  strokeWidth="1.5"
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
