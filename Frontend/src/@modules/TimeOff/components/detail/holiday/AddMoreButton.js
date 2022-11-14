// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common";
// ** Styles
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
// ** Components

const AddMoreButton = (props) => {
  const {
    // ** props
    // ** methods
    toggleModal,
    toggleAddFromCountryModal
  } = props;

  const handleAddFromCountry = () => {
    toggleAddFromCountryModal();
  };

  const handleAddManually = () => {
    toggleModal();
  };

  // ** render
  return (
    <div className="text-center">
      <UncontrolledButtonDropdown>
        <DropdownToggle color="primary" caret>
          {useFormatMessage("modules.time_off.buttons.add_holidays")}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => handleAddFromCountry()}>
            {useFormatMessage(
              "modules.time_off_holidays.buttons.add_from_country"
            )}
          </DropdownItem>
          <DropdownItem onClick={() => handleAddManually()}>
            {useFormatMessage("modules.time_off_holidays.buttons.add_manually")}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </div>
  );
};

export default AddMoreButton;
