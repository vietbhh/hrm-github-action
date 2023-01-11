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

const UserDropdown = ({
  toogleCustomizer,
  saveQuickAccess,
  settingPermits,
  menuHover,
  menuCollapsed,
  windowWidth,
  windowWidthMin,
  icon
}) => {
  // ** Store Vars
  const dispatch = useDispatch()
  const socket = useContext(SocketContext)
  // ** State
  const [userData, setUserData] = useState(null)
  const [changePwdModal, setchangePwdModal] = useState(false)
  const tooglePasswdModal = () => setchangePwdModal(!changePwdModal)

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")))
    }
  }, [])

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar
  const sidebarCollapsed =
    !menuHover && menuCollapsed === true && windowWidth >= windowWidthMin

  return (
    <Fragment>
      <UncontrolledDropdown className="dropdown-user nav-item">
        <DropdownToggle
          href="/"
          tag="a"
          className="nav-link dropdown-user-link"
          onClick={(e) => e.preventDefault()}>
          <Avatar
            src={userAvatar}
            imgHeight="40"
            imgWidth="40"
            status="online"
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
              {icon ? (
                icon
              ) : (
                <svg
                  className="ms-auto"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 9L12 5L16 9"
                    stroke="#11142D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 15L12 19L8 15"
                    stroke="#11142D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
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
