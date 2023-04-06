// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Table, Pagination, Tag } from "rsuite"
// ** Components
import { ErpSwitch } from "@apps/components/common/ErpField"
import { Button } from "reactstrap"

const { Column, HeaderCell, Cell } = Table

const TableWorkspace = (props) => {
  const {
    // ** props
    data,
    totalData,
    filter,
    // ** methods
    setFilter
  } = props

  const handleChangeLimit = (dataKey) => {
    setFilter({
      limit: dataKey
    })
  }

  const setPage = (currentPage) => {
    setFilter({
      page: currentPage
    })
  }

  // ** render
  const OwnerCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{rowData.owner.full_name}</Cell>
  }

  const VisibleCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        {rowData.type === "public" ? (
          <span>{rowData.type}</span>
        ) : (
          <Fragment>
            <span>{rowData.type}/</span>
            <span>{rowData.mode}</span>
          </Fragment>
        )}
      </Cell>
    )
  }

  const MemberCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{rowData.members.length}</Cell>
  }

  const StatusCell = ({ rowData, dataKey, ...props }) => {
    //return <Cell {...props}>{rowData?.status}</Cell>
    return (
      <Cell {...props}>
        <Tag bordered={false} color="green">
          Active
        </Tag>
      </Cell>
    )
  }

  const AllMemberCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <ErpSwitch />
      </Cell>
    )
  }

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <Button.Ripple color="flat-secondary" className="btn-icon">
          <i className="fa-solid fa-ellipsis" />
        </Button.Ripple>
      </Cell>
    )
  }

  return (
    <Fragment>
      <Table
        data={data}
        autoHeight={true}
        headerHeight={60}
        rowHeight={50}
        wordWrap="break-word"
        affixHorizontalScrollbar>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.workspace.fields.workspace_name")}
          </HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.workspace.fields.owner")}
          </HeaderCell>
          <OwnerCell />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.workspace.fields.visible")}
          </HeaderCell>
          <VisibleCell />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.workspace.text.members_capitalize")}
          </HeaderCell>
          <MemberCell />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.workspace.fields.status")}
          </HeaderCell>
          <StatusCell />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.workspace.text.all_member")}
          </HeaderCell>
          <AllMemberCell />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell></HeaderCell>
          <ActionCell />
        </Column>
      </Table>
      <div className="mt-1">
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
          total={totalData}
          limitOptions={[10, 30, 50]}
          limit={filter.limit}
          activePage={filter.page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </Fragment>
  )
}

export default TableWorkspace
