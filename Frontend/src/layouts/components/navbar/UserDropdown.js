// ** React Imports
import Avatar from "@apps/modules/download/pages/Avatar";
import { useFormatMessage } from "@apps/utility/common";
// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";

// ** Custom Components
//import Avatar from '@components/avatar'
// ** Utils
import { isUserLoggedIn } from "@utils";
import { useEffect, useState } from "react";
import { Airplay, HelpCircle, Lock, Power, User } from "react-feather";
// ** Store & Actions
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// ** Third Party Components
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import { handleLogout } from "redux/authentication";

const UserDropdown = (props) => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** State
  const [userData, setUserData] = useState(null);

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  }, []);

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar;

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">
            {userData && userData.full_name}
          </span>
          <span className="user-status">@{userData && userData.username}</span>
        </div>
        <Avatar src={userAvatar} imgHeight="40" imgWidth="40" status="online" />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/profile">
          <User size={14} className="me-75" />
          <span className="align-middle">
            {useFormatMessage("app.profile")}
          </span>
        </DropdownItem>
        <DropdownItem onClick={() => props.tooglePasswdModal()}>
          <Lock size={14} className="me-75" />
          <span className="align-middle">
            {useFormatMessage("app.changePassword")}
          </span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={() => props.toogleCustomizer()}>
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
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">
            {useFormatMessage("auth.logout")}
          </span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
