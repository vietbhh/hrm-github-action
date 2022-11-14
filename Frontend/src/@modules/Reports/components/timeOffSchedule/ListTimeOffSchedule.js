// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { Table, Pagination } from "rsuite"
import Avatar from "@apps/modules/download/pages/Avatar"
import TimeOffRequestStatus from "../attendance/TimeOffRequestStatus"

const { Column, HeaderCell, Cell } = Table

const ListTimeOffSchedule = (props) => {
  const {
    // ** props
    timeOffScheduleData
    // ** methods
  } = props

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)

  const tableData = timeOffScheduleData.filter((item, index) => {
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

  const StatusCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        {<TimeOffRequestStatus status={rowData.time_off_request_status} />}
      </Cell>
    )
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
                "modules.reports.time_off_schedule.text.table.employee_name"
              )}
            </HeaderCell>
            <EmployeeCell />
          </Column>
          <Column width={250} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_schedule.text.table.email"
              )}
            </HeaderCell>
            <Cell dataKey="email" />
          </Column>
          <Column width={200} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_schedule.text.table.job_title"
              )}
            </HeaderCell>
            <Cell dataKey="job_title_name" />
          </Column>
          <Column width={200} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_schedule.text.table.from"
              )}
            </HeaderCell>
            <Cell dataKey="date_from" />
          </Column>
          <Column width={200} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_schedule.text.table.to"
              )}
            </HeaderCell>
            <Cell dataKey="date_to" />
          </Column>
          <Column width={200} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_schedule.text.table.type"
              )}
            </HeaderCell>
            <Cell dataKey="type_name" />
          </Column>
          <Column width={200} align="left" verticalAlign="middle">
            <HeaderCell>
              {useFormatMessage(
                "modules.reports.time_off_schedule.text.table.status"
              )}
            </HeaderCell>
            <StatusCell />
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
            total={timeOffScheduleData.length}
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

export default ListTimeOffSchedule
