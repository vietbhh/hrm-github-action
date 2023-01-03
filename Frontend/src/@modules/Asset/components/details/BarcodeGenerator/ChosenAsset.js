// ** React Imports
// ** Styles
// ** Components
import TableAssetList from "./TableAssetList"

const ChosenAsset = (props) => {
  const {
    // ** props
    chosenAssetList
    // ** methods
  } = props

  // ** render
  return <TableAssetList displayCheckbox={false} listData={chosenAssetList} />
}

export default ChosenAsset
