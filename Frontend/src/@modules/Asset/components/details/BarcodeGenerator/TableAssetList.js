// ** React Imports
import { ErpCheckbox } from "@apps/components/common/ErpField"
import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { Table } from "rsuite"

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

    console.log(newChosen)
    setChosenAssetList(newChosen)
  }

  // ** render
  const AssetNameCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <div className="d-flex justify-content-left align-items-center text-dark">
          <Photo
            src={!_.isEmpty(rowData.recent_image) && rowData.recent_image?.url}
            width="60px"
            className="rounded"
          />

          <div className="d-flex flex-column cursor ms-1">
            <p className="text-truncate mb-0">
              <span className="font-weight-bold name-asset-table">
                {rowData?.asset_name}
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
  }

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
    <Table
      data={listData}
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
  )
}

export default TableAssetList
