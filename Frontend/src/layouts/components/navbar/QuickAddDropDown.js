import { Plus, User } from "react-feather";
import { Link } from 'react-router-dom';
import {
    Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";

const QuickAddDropDown = (props) => {
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <Button.Ripple
          size="sm"
          className="btn-icon rounded-circle btn-add-header"
          color="primary"
        >
          <Plus size={16} />
        </Button.Ripple>
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/employees/add">
          <User size={14} className="me-75" />
          <span className="align-middle">Employees</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default QuickAddDropDown;
