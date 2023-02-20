// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Table, Pagination } from "rsuite"
// ** Components
import AssetBrandAction from "./AssetBrandAction"

const { Column, HeaderCell, Cell } = Table

const TableAssetBrand = (props) => {
  const {
    // ** props
    listData,
    totalData,
    page,
    limit,
    // ** methods
    setIsEditing,
    setEditData,
    setFilter,
    toggleModal,
    handleDeleteAssetBrand
  } = props

  const setLimit = (dataKey) => {
    setFilter("limit", dataKey)
  }

  const setPage = (currentPage) => {
    setFilter("page", currentPage)
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  // ** render
  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <AssetBrandAction
          assetBrand={rowData}
          setIsEditing={setIsEditing}
          setEditData={setEditData}
          toggleModal={toggleModal}
          handleDeleteAssetBrand={handleDeleteAssetBrand}
        />
      </Cell>
    )
  }

  return (
    <Fragment>
      <Table
        data={listData}
        autoHeight={true}
        headerHeight={60}
        rowHeight={40}
        wordWrap="break-word"
        affixHorizontalScrollbar>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_brands.fields.brand_name")}
          </HeaderCell>
          <Cell dataKey="brand_name" />
        </Column>
        <Column flexGrow={2} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_brands.fields.description")}
          </HeaderCell>
          <Cell dataKey="description" />
        </Column>
        <Column width={150} align="center" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_types.text.action")}
          </HeaderCell>
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
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </Fragment>
  )
}

export default TableAssetBrand
