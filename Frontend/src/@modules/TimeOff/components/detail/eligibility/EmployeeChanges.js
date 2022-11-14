// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { formatViewListText } from "@modules/TimeOff/common/common";
// ** Styles
// ** Components

const EmployeeChanges = (props) => {
  const {
    // ** props
    listEmployeeAdd,
    listEmployeeRemove,
    // ** methods
    toggleListEmployeeModal
  } = props;

  const totalEmployeeAdd = listEmployeeAdd.length;
  const totalEmployeeRemove = listEmployeeRemove.length;

  const handleViewEmployeeList = () => {
    toggleListEmployeeModal();
  }

  // ** render
  const renderViewEmployee = () => {
    const displayText = useFormatMessage(
      "modules.time_off_policies.text.view_list_employee"
    );
    const replaceValue = (
      <span className="view-list-employee" key={`employee_view`} onClick={() => handleViewEmployeeList()}>
        {useFormatMessage("modules.time_off_policies.text.view")}
      </span>
    );
    const result = formatViewListText(displayText, "view_button", replaceValue);

    return result;
  };

  if (totalEmployeeAdd === 0 &&  totalEmployeeRemove === 0) {
    return (<div></div>);
  }

  return (
    <div className="employee-changes">
      <h6>
        {useFormatMessage("modules.time_off_policies.title.employee_changes")}
      </h6>
      <ul>
        <li>
          {totalEmployeeAdd}{" "}
          {useFormatMessage(
            "modules.time_off_policies.text.employees_will_be_added"
          )}
        </li>
        <li>
          {totalEmployeeRemove}{" "}
          {useFormatMessage(
            "modules.time_off_policies.text.employees_will_be_removed"
          )}
        </li>
      </ul>
      <span>{renderViewEmployee()}</span>
    </div>
  );
};

export default EmployeeChanges;
