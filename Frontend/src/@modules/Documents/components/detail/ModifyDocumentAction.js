// ** React Imports
import { coppyLink, useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { DocumentApi } from "@modules/Documents/common/api"
import { useNavigate } from "react-router-dom"
// ** Styles
import { Popover } from "antd"
import { Copy, Edit, MoreVertical, Trash, FolderPlus } from "react-feather"
import { Button } from "reactstrap"
// ** Components
import SwAlert from "@apps/utility/SwAlert"
import { Fragment } from "react"

const ModifyDocumentAction = (props) => {
  const {
    // ** props
    isEditable,
    redirectBack,
    folderData,
    // ** methods
    handleModal,
    setModalData,
    loadData,
    setLoading,
    setParentFolder
  } = props

  const history = useNavigate()

  const handleEditFolder = () => {
    if (!isEditable) {
      return false
    }
    
    setModalData(folderData)
    handleModal()
  }

  const handleCopyFolderLink = () => {
    const pathname = "/documents"
    coppyLink(`${window.location.origin}${pathname}/${folderData.id}`)
  }

  const handleDeleteFolder = () => {
    if (!isEditable) {
      return false
    }

    SwAlert.showWarning({
      title: `Delete "${folderData.name}" folder?`,
      confirmButtonText: useFormatMessage("button.delete"),
      text: useFormatMessage("modules.documents.text.confirm_delete_document")
    }).then((res) => {
      if (res.value) {
        _deleteFolderRequest()
      }
    })
  }

  const _deleteFolderRequest = () => {
    setLoading(true)
    DocumentApi.postDeleteDocument(folderData.id)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        if (redirectBack === true) {
          history("/documents")
        }
        loadData()
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
        setLoading(false)
      })
  }

  const handleAddChildFolder = () => {
    if (!isEditable) {
      return false
    }

    setModalData({})
    setParentFolder(folderData.id)
    handleModal()
  }

  // ** render
  const renderButton = () => {
    return (
      <Fragment>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          disabled={!isEditable}
          onClick={() => handleAddChildFolder()}>
          <FolderPlus className="me-50" size={15} />{" "}
          {useFormatMessage("modules.documents.buttons.add_folder")}
        </Button.Ripple>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          disabled={!isEditable}
          onClick={() => handleEditFolder()}>
          <Edit className="me-50" size={15} />{" "}
          {useFormatMessage("modules.documents.buttons.edit_folder")}
        </Button.Ripple>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          onClick={() => handleCopyFolderLink()}>
          <Copy className="me-50" size={15} />{" "}
          {useFormatMessage("modules.documents.buttons.copy_link")}
        </Button.Ripple>
        <Button.Ripple
          color="flat-danger"
          size="sm"
          disabled={!isEditable}
          onClick={() => handleDeleteFolder()}>
          <Trash className="me-50" size={15} />{" "}
          {useFormatMessage("modules.documents.buttons.delete_folder")}
        </Button.Ripple>
      </Fragment>
    )
  }

  return (
    <Popover
      placement="bottom"
      content={renderButton()}
      trigger="click"
      overlayClassName="popover-checklist-action">
      <Button.Ripple size="sm" className="btn-icon" color="flat-primary">
        <MoreVertical size="15" />
      </Button.Ripple>
    </Popover>
  )
}

export default ModifyDocumentAction
ModifyDocumentAction.defaultProps = {
  redirectBack: false
}
