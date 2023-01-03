// ** React Imports
// ** Styles
// ** Components
import TableAssetList from "./TableAssetList"

const ChoseAsset = (props) => {
  const {
    // ** props
    assetList,
    chosenAssetList,
    // ** methods
    setChosenAssetList
  } = props

  // ** render
  return (
    <TableAssetList
      displayCheckbox={true}
      listData={assetList}
      chosenAssetList={chosenAssetList}
      setChosenAssetList={setChosenAssetList}
    />
  )
}

export default ChoseAsset
