// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Table, Pagination } from "rsuite"
// ** Components
import AssetGroupAction from "./AssetGroupAction"

const { Column, HeaderCell, Cell } = Table

const TableAssetGroup = (props) => {
  const {
    // ** props
    listData,
    // ** methods
    setIsEditing,
    setEditData,
    toggleModal,
    handleDeleteAssetGroup
  } = props

  const [limit, setLimit] = useState(30)
  const [page, setPage] = useState(1)

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  const data = listData.filter((value, index) => {
    {
      const start = limit * (page - 1)
      const end = start + limit
      return index >= start && index < end
    }
  })

  // ** render
  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <AssetGroupAction
          assetGroup={rowData}
          setIsEditing={setIsEditing}
          setEditData={setEditData}
          toggleModal={toggleModal}
          handleDeleteAssetGroup={handleDeleteAssetGroup}
        />
      </Cell>
    )
  }

  return (
    <Fragment>
      <Table
        data={data}
        autoHeight={true}
        rowHeight={60}
        affixHorizontalScrollbar>
        <Column width={250} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_groups.fields.asset_group_code")}
          </HeaderCell>
          <Cell dataKey="asset_group_code" />
        </Column>
        <Column width={300} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_groups.fields.asset_group_name")}
          </HeaderCell>
          <Cell dataKey="asset_group_name" />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage(
              "modules.asset_groups.fields.asset_group_descriptions"
            )}
          </HeaderCell>
          <Cell dataKey="asset_group_descriptions" />
        </Column>
        <Column width={150} align="center" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_groups.text.action")}
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
          total={listData.length}
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
