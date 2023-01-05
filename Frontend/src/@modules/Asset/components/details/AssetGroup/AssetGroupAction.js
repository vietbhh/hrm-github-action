// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Button } from "reactstrap"
import { Trash } from "react-feather"
// ** Components

const AssetGroupAction = (props) => {
  const {
    // ** props
    assetGroup,
    // ** methods
    setIsEditing,
    setEditData,
    toggleModal,
    handleDeleteAssetGroup
  } = props

  const handleClickDelete = () => {
    handleDeleteAssetGroup(assetGroup.id)
  }

  const handleClickEdit = () => {
    setEditData(assetGroup)
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
        onClick={() => handleClickEdit()}>
        <i className="iconly-Edit-Square icli"></i>
      </Button.Ripple>
      <Button.Ripple
        color="flat-dark"
        size="sm"
        className="btn-delete"
        onClick={() => handleClickDelete()}>
        <Trash size={15} />
      </Button.Ripple>
    </Fragment>
  )
}

export default AssetGroupAction
