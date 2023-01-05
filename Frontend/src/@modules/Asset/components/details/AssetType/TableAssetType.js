// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Table, Pagination } from "rsuite"
// ** Components
import AssetTypeAction from "./AssetTypeAction"

const { Column, HeaderCell, Cell } = Table

const TableAssetGroup = (props) => {
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
    handleDeleteAssetType
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
        <AssetTypeAction
          assetType={rowData}
          setIsEditing={setIsEditing}
          setEditData={setEditData}
          toggleModal={toggleModal}
          handleDeleteAssetType={handleDeleteAssetType}
        />
      </Cell>
    )
  }

  return (
    <Fragment>
      <Table
        data={listData}
        autoHeight={true}
        rowHeight={60}
        affixHorizontalScrollbar>
        <Column width={250} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_types.fields.asset_type_code")}
          </HeaderCell>
          <Cell dataKey="asset_type_code" />
        </Column>
        <Column width={300} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_types.fields.asset_type_name")}
          </HeaderCell>
          <Cell dataKey="asset_type_name" />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage(
              "modules.asset_types.fields.asset_type_descriptions"
            )}
          </HeaderCell>
          <Cell dataKey="asset_type_descriptions" />
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

export default TableAssetGroup
