// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Trash } from "react-feather"
import { Button } from "reactstrap"
// ** Components

const AssetBrandAction = (props) => {
  const {
    // ** props
    assetBrand,
    // ** methods
    setIsEditing,
    setEditData,
    toggleModal,
    handleDeleteAssetBrand
  } = props

  const handleClickDelete = () => {
    handleDeleteAssetBrand(assetBrand.id)
  }

  const handleClickEdit = () => {
    setEditData(assetBrand)
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

export default AssetBrandAction
