// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { formatNumberToDisplay } from "../../common/common"
// ** Styles
// ** Components
import { Table, Pagination } from "rsuite"
import Avatar from "@apps/modules/download/pages/Avatar"

const { Column, HeaderCell, Cell } = Table

const ListTimeOffBalance = (props) => {
  const {
    // ** props
    timeOffBalanceData
    // ** methods
  } = props

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)

  const tableData = timeOffBalanceData.filter((item, index) => {
    const start = limit * (page - 1)
    const end = start + limit
    return index >= start && index < end
  })

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  // ** render
  const EmployeeCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <div>
          <Avatar
            src={rowData.avatar}
            imgHeight="30"
            imgWidth="30"
            className="me-50"
          />
          <span>{rowData.full_name}</span>
        </div>
      </Cell>
    )
  }

  const EntitlementCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{formatNumberToDisplay(rowData.entitlement)}</Cell>
  }

  const CarryOverCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{formatNumberToDisplay(rowData.carryover)}</Cell>
  }

  const RequestedCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{formatNumberToDisplay(rowData.requested)}</Cell>
  }

  const BalanceCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{formatNumberToDisplay(rowData.balance)}</Cell>
  }

  const renderTable = () => {
    return (
      <Fragment>
        <Table
          autoHeight={true}
          data={tableData}
          rowHeight={60}
          affixHorizontalScrollbar>
          <Column width={330} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_balance.text.table.employee_name"
              )}
            </HeaderCell>
            <EmployeeCell />
          </Column>
          <Column width={200} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_balance.text.table.department"
              )}
            </HeaderCell>
            <Cell dataKey="department_name" />
          </Column>
          <Column width={200} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_balance.text.table.office"
              )}
            </HeaderCell>
            <Cell dataKey="office_name" />
          </Column>
          <Column width={200} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_balance.text.table.type"
              )}
            </HeaderCell>
            <Cell dataKey="type_name" />
          </Column>
          <Column width={150} align="right" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_balance.text.table.entitlement"
              )}
            </HeaderCell>
            <EntitlementCell />
          </Column>
          <Column width={150} align="right" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_balance.text.table.carry_over"
              )}
            </HeaderCell>
            <CarryOverCell />
          </Column>
          <Column width={150} align="right" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_balance.text.table.requested"
              )}
            </HeaderCell>
            <RequestedCell />
          </Column>
          <Column flexGrow={1} align="right" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_balance.text.table.balance"
              )}
            </HeaderCell>
            <BalanceCell />
          </Column>
        </Table>
        <div className="table-pagination">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={["total", "-", "limit", "|", "pager", "skip"]}
            total={timeOffBalanceData.length}
            limitOptions={[10, 20]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderTable()}</Fragment>
}

export default ListTimeOffBalance
