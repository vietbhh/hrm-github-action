import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
import { Settings } from "react-feather"
import { Link } from "react-router-dom"
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap"

const SettingDropdown = ({ settingMenu }) => {
  return (
    <UncontrolledDropdown tag="li" className="dropdown-notification nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}>
        <Settings size={19} />
      </DropdownToggle>
      <DropdownMenu end style={{ marginTop: 0 }}>
        {_.map(settingMenu, (item, index) => (
          <Fragment key={index}>
            {item.dividerBefore && <DropdownItem divider />}
            <DropdownItem key={item.id} tag={Link} to={item.navLink}>
              <i className={`${item.icon} me-75`}></i>
              <span className="align-middle">
                {useFormatMessage(item.title)}
              </span>
            </DropdownItem>
            {item.dividerAfter && <DropdownItem divider />}
          </Fragment>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default SettingDropdown
