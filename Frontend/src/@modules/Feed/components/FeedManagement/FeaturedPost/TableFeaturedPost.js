// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useNavigate } from "react-router-dom"
import { feedApi } from "@modules/Feed/common/api"
// ** Styles
import { Table, Pagination, Tag } from "rsuite"
import { Button } from "reactstrap"
// ** Components
import ActionTable from "./ActionTable"
import PostContentTable from "./PostContentTable"
import Avatar from "@apps/modules/download/pages/Avatar"
import moment from "moment"

const { Column, HeaderCell, Cell } = Table

const TableFeaturedPost = (props) => {
  const {
    // ** props
    loading,
    data,
    workspaceData,
    totalData,
    filter,
    // ** methods
    setFilter,
    setData,
    toggleModalPreview,
    setDataPreview
  } = props

  const navigate = useNavigate()

  const [state, setState] = useMergedState({
    sortColumn: "",
    sortType: "asc",
    dataTable: [],
    loadingTable: loading
  })

  const handleChangeLimit = (dataKey) => {
    setFilter({
      limit: dataKey
    })
  }

  const setPage = (currentPage) => {
    setFilter({
      page: currentPage - 1
    })
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

  const handleClickViewDetail = (id) => {
    if (!_.isEmpty(id)) {
      navigate(`/posts/${id}/dashboard`)
    }
  }

  // ** render
  const AuthorCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <div className="d-flex align-items-center">
          <Avatar src={rowData.owner.avatar} className="me-50" />
          <p className="mb-0">{rowData.owner.username}</p>
        </div>
      </Cell>
    )
  }

  const PostCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <PostContentTable rowData={rowData} workspaceData={workspaceData} />
      </Cell>
    )
  }

  const DateCreatedCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        {moment(rowData.created_at).format("DD/MM/YYYY")}
      </Cell>
    )
  }

  const DetailCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <Button.Ripple
          size="sm"
          className="custom-success-btn"
          onClick={() => handleClickViewDetail(rowData._id)}>
          {useFormatMessage("modules.feed.manage_post.buttons.details")}
        </Button.Ripple>
      </Cell>
    )
  }

  const ActionCell = ({ rowData, dataKey, data, ...props }) => {
    return (
      <Cell {...props}>
        <ActionTable
          data={data}
          rowData={rowData}
          setData={setData}
          toggleModalPreview={toggleModalPreview}
          setDataPreview={setDataPreview}
        />
      </Cell>
    )
  }

  return (
    <Fragment>
      <Table
        data={getDataTable()}
        loading={loading}
        autoHeight={true}
        headerHeight={60}
        rowHeight={80}
        affixHorizontalScrollbar
        sortColumn={state.sortColumn}
        sortType={state.sortType}
        onSortColumn={handleSortColumn}
        className="table-list-workspace">
        <Column width={220} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage(
              "modules.feed.manage_post.display.table_featured_post.author"
            )}
          </HeaderCell>
          <AuthorCell />
        </Column>
        <Column width={220} align="left" fixed verticalAlign="middle" fullText>
          <HeaderCell>
            {useFormatMessage(
              "modules.feed.manage_post.display.table_featured_post.post"
            )}
          </HeaderCell>
          <PostCell />
        </Column>
        <Column width={100} align="left" fixed verticalAlign="middle" sortable>
          <HeaderCell>
            {useFormatMessage(
              "modules.feed.manage_post.display.table_featured_post.views"
            )}
          </HeaderCell>
          <Cell dataKey="seen_count" />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle" sortable>
          <HeaderCell>
            {useFormatMessage(
              "modules.feed.manage_post.display.table_featured_post.comments"
            )}
          </HeaderCell>
          <Cell dataKey="comment_number" />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle" sortable>
          <HeaderCell>
            {useFormatMessage(
              "modules.feed.manage_post.display.table_featured_post.reactions"
            )}
          </HeaderCell>
          <Cell dataKey="reaction_number" />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage(
              "modules.feed.manage_post.display.table_featured_post.date_crated"
            )}
          </HeaderCell>
          <DateCreatedCell />
        </Column>
        <Column width={110} align="left" fixed verticalAlign="middle">
          <HeaderCell></HeaderCell>
          <DetailCell />
        </Column>
        <Column width={60} align="left" fixed verticalAlign="middle">
          <HeaderCell></HeaderCell>
          <ActionCell data={data} />
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

export default TableFeaturedPost
