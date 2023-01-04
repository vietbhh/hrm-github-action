// ** React Imports
// ** Styles
import { Space } from "antd"
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
    <Space>
      <Button.Ripple
        color="flat-danger"
        className="btn-icon"
        onClick={() => handleClickDelete()}>
        <i className="fas fa-trash-alt" />
      </Button.Ripple>
      <Button.Ripple
        color="flat-primary"
        className="btn-icon"
        onClick={() => handleClickEdit()}>
        <i className="fas fa-edit" />
      </Button.Ripple>
    </Space>
  )
}

export default AssetGroupAction
