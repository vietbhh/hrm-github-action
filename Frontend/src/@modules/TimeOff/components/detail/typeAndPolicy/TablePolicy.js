// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
// ** Styles
import { Table } from "rsuite";
import { Button } from "reactstrap";
// ** Components
import PolicyAction from "./PolicyAction";

const { Column, HeaderCell, Cell } = Table;
const TablePolicy = (props) => {
  const {
    // ** props
    listPolicy,
    activeType,
    // ** methods
    setAddType,
    setIsEditPolicy,
    setPolicyData,
    setIsEditEligibility
  } = props;

  const handleAssignEligibility = (policy) => {
    setIsEditEligibility(false);
    setPolicyData(policy);
    setAddType("eligibility_policy");
  };

  // ** render
  const EligibilityCell = ({ rowData, dataKey, ...props }) => {
    if (rowData.eligibility_applicable.length === 0) {
      return (
        <Cell {...props}>
          <Button.Ripple
            size="sm"
            onClick={() => handleAssignEligibility(rowData)}
            color="primary"
          >
            {useFormatMessage(
              "modules.time_off_policies.buttons.assign_eligibility"
            )}
          </Button.Ripple>
        </Cell>
      );
    } else {
      return (
        <Cell {...props}>
          <p className="mb-0">{useFormatMessage(rowData.eligibility_applicable.label)}</p>
        </Cell>
      );
    }
  };

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <PolicyAction
          policyData={rowData}
          activeType={activeType}
          setAddType={setAddType}
          setIsEditPolicy={setIsEditPolicy}
          setPolicyData={setPolicyData}
          setIsEditEligibility={setIsEditEligibility}
        />
      </Cell>
    );
  };
  return (
    <Table data={listPolicy} id="table" className="policy-table">
      <Column width={300} align="left" verticalAlign="middle">
        <HeaderCell>
          {useFormatMessage("modules.time_off_policies.fields.name")}
        </HeaderCell>
        <Cell dataKey="name" />
      </Column>
      <Column width={300} align="left" verticalAlign="middle">
        <HeaderCell>
          {useFormatMessage("modules.time_off_policies.fields.description")}
        </HeaderCell>
        <Cell dataKey="description" />
      </Column>
      <Column width={350} align="left" verticalAlign="middle">
        <HeaderCell>
          {useFormatMessage("modules.time_off_policies.fields.eligibility")}
        </HeaderCell>
        <EligibilityCell />
      </Column>
      <Column flexGrow={1} align="right" className="policy-action-cell" verticalAlign="middle">
        <HeaderCell></HeaderCell>
        <ActionCell />
      </Column>
    </Table>
  );
};

export default TablePolicy;
