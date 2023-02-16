// ** React Imports
// ** Styles
// ** Components
import TableAssetList from "./TableAssetList"

const ChoseAsset = (props) => {
  const {
    // ** props
    loadingTable,
    totalRecord,
    assetList,
    chosenAssetList,
    filter,
    // ** methods
    setChosenAssetList,
    setFilterByObj
  } = props

  // ** render
  return (
    <TableAssetList
      loadingTable={loadingTable}
      displayCheckbox={true}
      listData={assetList}
      totalRecord={totalRecord}
      chosenAssetList={chosenAssetList}
      filter={filter}
      loadDataFromApi={true}
      setChosenAssetList={setChosenAssetList}
      setFilterByObj={setFilterByObj}
    />
  )
}

export default ChoseAsset
