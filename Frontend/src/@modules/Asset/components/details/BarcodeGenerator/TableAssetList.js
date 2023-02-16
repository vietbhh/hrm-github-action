// ** React Imports
import { Fragment, useCallback, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { Table, Pagination } from "rsuite"
import { ErpCheckbox } from "@apps/components/common/ErpField"
import Photo from "@apps/modules/download/pages/Photo"

const { Column, HeaderCell, Cell } = Table

const TableAssetList = (props) => {
  const {
    // ** props
    displayCheckbox,
    listData,
    chosenAssetList,
    // ** methods
    setChosenAssetList
  } = props

  const [limit, setLimit] = useState(30)
  const [page, setPage] = useState(1)

  const handleCheckAll = (checked) => {
    const newChosen = checked
      ? listData.map((item) => {
          return item
        })
      : []
    setChosenAssetList(newChosen)
  }

  const handleCheck = (value, checked) => {
    const newChosen = checked
      ? [...chosenAssetList, value]
      : chosenAssetList.filter((item) => {
          return item.id !== value.id
        })

    setChosenAssetList(newChosen)
  }

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
  const AssetNameCell = useCallback(
    (props) => {
      const { field, rowData, cellProps } = props
      return (
        <Cell {...props}>
          <div className="d-flex justify-content-left align-items-center text-dark">
            <Photo
              src={
                !_.isEmpty(rowData.recent_image) && rowData.recent_image?.url
              }
              width="60px"
              className="rounded"
            />

            <div className="d-flex flex-column cursor ms-1">
              <p className="text-truncate mb-0">
                <span className="font-weight-bold name-asset-table">
                  {rowData?.asset_type?.label}
                </span>
                <br />
                <span className="font-weight-bold name-asset-table">
                  {rowData?.asset_code}
                </span>
                <br />
                <span className="font-weight-bold name-asset-table">
                  {rowData?.asset_group_code}
                </span>
              </p>
            </div>
          </div>
        </Cell>
      )
    },
    [listData]
  )

  const CheckCell = ({
    rowData,
    dataKey,
    onChange,
    chosenAssetList,
    ...props
  }) => {
    return (
      <Cell {...props}>
        <ErpCheckbox
          defaultValue={rowData[dataKey]}
          inline
          onChange={(e) => {
            handleCheck(rowData, e.target.checked)
          }}
          checked={chosenAssetList.some(
            (item) =>
              parseInt(item.id) === parseInt(rowData[dataKey]) ||
              item.id === rowData[dataKey]
          )}
          id={`select_row_${rowData[dataKey]}`}
          name={`select_row_${rowData[dataKey]}`}
        />
      </Cell>
    )
  }

  return (
    <Fragment>
      <Table
        data={data}
        autoHeight={true}
        rowHeight={90}
        affixHorizontalScrollbar>
        {displayCheckbox && (
          <Column width={50} align="center" fixed verticalAlign="middle">
            <HeaderCell>
              <div style={{ lineHeight: "40px" }}>
                <ErpCheckbox
                  id="select_all_row"
                  name="select_all_row"
                  inline
                  defaultChecked={false}
                  onChange={(e) => {
                    handleCheckAll(e.target.checked)
                  }}
                />
              </div>
            </HeaderCell>
            <CheckCell
              dataKey="id"
              chosenAssetList={chosenAssetList}
              onChange={handleCheck}
            />
          </Column>
        )}
        <Column width={320} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_lists.fields.asset_name")}
          </HeaderCell>
          <AssetNameCell />
        </Column>
        <Column width={200} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_brands.fields.brand_name")}
          </HeaderCell>
          <Cell dataKey="brand_name" />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_lists.fields.asset_status")}
          </HeaderCell>
          <Cell dataKey="status_name" />
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

export default TableAssetList
