// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Trash } from "react-feather"
import { Button } from "reactstrap"
// ** Components

const AssetGroupAction = (props) => {
  const {
    // ** props
    assetType,
    // ** methods
    setIsEditing,
    setEditData,
    toggleModal,
    handleDeleteAssetType
  } = props

  const handleClickDelete = () => {
    handleDeleteAssetType(assetType.id)
  }

  const handleClickEdit = () => {
    setEditData(assetType)
    setIsEditing(true)
    toggleModal()
  }

  // ** render
  return (
    <Fragment>
      <Button.Ripple
        color="flat-dark"
        size="sm"
        className="btn-edit"
        onClick={() => handleClickDelete()}>
        <i className="iconly-Edit-Square icli"></i>
      </Button.Ripple>
      <Button.Ripple
        color="flat-dark"
        size="sm"
        className="btn-delete"
        onClick={() => handleClickEdit()}>
        <Trash size={15} />
      </Button.Ripple>
    </Fragment>
  )
}

export default AssetGroupAction
