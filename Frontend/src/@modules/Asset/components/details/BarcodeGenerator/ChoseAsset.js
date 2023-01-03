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
    <div className="me-1">
      <TableAssetList
        displayCheckbox={true}
        listData={assetList}
        chosenAssetList={chosenAssetList}
        setChosenAssetList={setChosenAssetList}
      />
    </div>
  )
}

export default ChoseAsset
