// ** React Imports
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
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
