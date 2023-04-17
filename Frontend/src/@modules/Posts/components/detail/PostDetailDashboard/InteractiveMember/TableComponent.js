// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Link } from "react-router-dom"
// ** Styles
import { Table, Pagination, Tag } from "rsuite"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const { Column, HeaderCell, Cell } = Table

const TableComponent = (props) => {
  const {
    // ** props
    loading,
    data,
    totalData,
    filter,
    // ** methods
    setFilter
  } = props

  const setPage = (page) => {
    setFilter({
      page: page - 1
    })
  }

  const handleChangeLimit = (dataKey) => {
    setFilter({
      limit: dataKey
    })
  }

  // ** render
  const MemberCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <Link to={`/employees/u/${rowData.username}`}>
          <div className="d-flex align-items-center">
            <Avatar className="me-50 mb-50" />
            <div>
              <p className="mb-0 lh-1">{rowData.full_name}</p>
              <small>{rowData.username}</small>
            </div>
          </div>
        </Link>
      </Cell>
    )
  }

  return (
    <Fragment>
      <Table
        data={data}
        loading={loading}
        autoHeight={true}
        headerHeight={60}
        rowHeight={50}
        wordWrap="break-word"
        affixHorizontalScrollbar
        className="table-post-interact-member">
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.posts.post_details.text.members")}
          </HeaderCell>
          <MemberCell />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.posts.post_details.text.email")}
          </HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.posts.post_details.text.phone_number")}
          </HeaderCell>
          <Cell dataKey="phone" />
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
          limitOptions={[10, 20, 40]}
          limit={filter.limit}
          activePage={filter.page + 1}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </Fragment>
  )
}

export default TableComponent
