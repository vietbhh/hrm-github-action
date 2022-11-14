// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { Table } from "rsuite"
import Avatar from "@apps/modules/download/pages/Avatar"

const { Column, HeaderCell, Cell } = Table

const ListEmployeeGroup = (props) => {
  const {
    // ** props
    employeeGroup
    // ** methods
  } = props

  // ** render
  const EmployeeNameCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="checklist-detail-action">
        <div className="d-flex align-items-center">
          <Avatar
            src={rowData.avatar}
            imgHeight="28"
            imgWidth="28"
            className="me-50"
          />
          <p className="mb-0">{rowData.full_name}</p>
        </div>
      </Cell>
    )
  }

  const renderComponent = () => {
    if (employeeGroup.length === 0) {
      return <Fragment></Fragment>
    }

    return (
      <Table autoHeight={true} data={employeeGroup} rowHeight={60}>
        <Column flexGrow={1} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage(
              "modules.employee_groups.text.list_employee.employee_name"
            )}
          </HeaderCell>
          <EmployeeNameCell />
        </Column>
        <Column flexGrow={2} align="left" verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage(
              "modules.employee_groups.text.list_employee.employee_address"
            )}
          </HeaderCell>
          <Cell dataKey="email" />
        </Column>
      </Table>
    )
  }

  return <div>{renderComponent()}</div>
}

export default ListEmployeeGroup
