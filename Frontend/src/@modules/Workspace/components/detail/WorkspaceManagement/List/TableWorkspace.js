// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "../../../../common/api"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
// ** Styles
import { Table, Pagination, Tag } from "rsuite"
import { Dropdown } from "antd"
import { Button } from "reactstrap"
// ** Components
import { ErpSwitch } from "@apps/components/common/ErpField"
import ActionTable from "./ActionTable"

const { Column, HeaderCell, Cell } = Table

const TableWorkspace = (props) => {
  const {
    // ** props
    loading,
    data,
    totalData,
    filter,
    // ** methods
    setFilter,
    setData
  } = props

  const [state, setState] = useMergedState({
    sortColumn: "name",
    sortType: "asc",
    dataTable: [],
    loadingTable: loading
  })

  const userAuth = useSelector((state) => state.auth.userData)

  const history = useNavigate()

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

  const handleSwitchAllMember = (e, rowData) => {
    workspaceApi
      .update(rowData._id, {
        all_member: e.target.checked
      })
      .then((res) => {})
      .catch((err) => {})
  }

  const handleSortColumn = (sortColumn, sortType) => {
    setState({
      loadingTable: true
    })

    setState({
      sortColumn: sortColumn,
      sortType: sortType,
      loadingTable: false
    })
  }

  const getDataTable = () => {
    if (state.sortColumn && state.sortType) {
      return data.sort((a, b) => {
        let x = a[state.sortColumn]
        let y = b[state.sortColumn]
        if (typeof x === "string") {
          x = x.charCodeAt()
        }
        if (typeof y === "string") {
          y = y.charCodeAt()
        }
        if (state.sortType === "asc") {
          return x - y
        } else {
          return y - x
        }
      })
    }

    return data
  }

  const handleClickViewDetail = (workspaceId) => {
    history(`/workspace/${workspaceId}`)
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

  const StatusCell = ({ rowData, dataKey, ...props }) => {
    const currentStatus =
      rowData?.status === undefined ? "active" : rowData.status
    return (
      <Cell {...props}>
        <Tag color={currentStatus === "active" ? "green" : "red"}>
          {useFormatMessage(
            `modules.workspace.options.status.${currentStatus}`
          )}
        </Tag>
      </Cell>
    )
  }

  const AllMemberCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <ErpSwitch
          nolabel={true}
          onChange={(e) => handleSwitchAllMember(e, rowData)}
          defaultValue={rowData.all_member}
        />
      </Cell>
    )
  }

  const ActionCell = ({ rowData, dataKey, data, ...props }) => {
    return (
      <Cell {...props}>
        <ActionTable
          data={data}
          rowData={rowData}
          userAuth={userAuth}
          setData={setData}
        />
      </Cell>
    )
  }

  const PostCratedCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        {rowData.post_created === undefined ? 0 : rowData.post_created}
      </Cell>
    )
  }

  const ViewDetailCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <Button.Ripple size="sm" className="custom-success-btn" onClick={() => handleClickViewDetail(rowData._id)}>
          {useFormatMessage("modules.workspace.buttons.view_detail")}
        </Button.Ripple>
      </Cell>
    )
  }

  const renderColumn = () => {
    if (filter.query_type === "information") {
      return (
        <Fragment>
          <Column
            flexGrow={2}
            align="left"
            fixed
            verticalAlign="middle"
            sortable>
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
          <Column
            flexGrow={1}
            align="left"
            fixed
            verticalAlign="middle"
            sortable>
            <HeaderCell>
              {useFormatMessage("modules.workspace.text.members_capitalize")}
            </HeaderCell>
            <Cell dataKey="total_member" />
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
            <ActionCell data={data} />
          </Column>
        </Fragment>
      )
    } else if (filter.query_type === "activity") {
      return (
        <Fragment>
          <Column
            flexGrow={1}
            align="left"
            fixed
            verticalAlign="middle"
            sortable>
            <HeaderCell>
              {useFormatMessage("modules.workspace.fields.workspace_name")}
            </HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column
            flexGrow={1}
            align="left"
            fixed
            verticalAlign="middle"
            sortable>
            <HeaderCell>
              {useFormatMessage("modules.workspace.display.post_created")}
            </HeaderCell>
            <PostCratedCell dataKey="post_created" />
          </Column>
          <Column flexGrow={1} align="left" fixed verticalAlign="middle">
            <HeaderCell></HeaderCell>
            <ViewDetailCell />
          </Column>
        </Fragment>
      )
    }
  }

  return (
    <Fragment>
      <Table
        data={getDataTable()}
        loading={loading}
        autoHeight={true}
        headerHeight={60}
        rowHeight={50}
        wordWrap="break-word"
        affixHorizontalScrollbar
        sortColumn={state.sortColumn}
        sortType={state.sortType}
        onSortColumn={handleSortColumn}
        className="table-list-workspace">
        <Fragment>{renderColumn()}</Fragment>
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
          limitOptions={[10, 20, 40]}
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
