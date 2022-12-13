// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Space } from "antd"
// ** Styles
// ** Components

const NotificationHeader = (props) => {
  const {
    // ** props
    listUploadingFile,
    showUploadContent,
    // ** methods
    handleCloseUploadNotification,
    handleOpenUploadModal,
    toggleShowUploadContent
  } = props

  const handleClickOpenUploadModal = () => {
    handleCloseUploadNotification()
    handleOpenUploadModal()
  }

  const handleClickCLose = () => {
    let closeable = true

    _.map(listUploadingFile, (item) => {
      if (item.progress < 100) {
        closeable = false
      }
    })

    if (!closeable) {
      return false
    }

    handleCloseUploadNotification()
  }

  const handleToggleUploadContent = () => {
    toggleShowUploadContent()
  }

  // ** render
  const renderShowUploadContentIcon = () => {
    if (showUploadContent) {
      return (
        <Fragment>
          <div
            className="me-50 d-flex align-items-center justify-content-center icon-item"
            onClick={() => handleToggleUploadContent()}>
            <i className="fas fa-angle-down "></i>
          </div>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <div
          className="me-50 d-flex align-items-center justify-content-center icon-item"
          onClick={() => handleToggleUploadContent()}>
          <i className="fas fa-angle-up "></i>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between notification-header-container">
        <div>{useFormatMessage("modules.drive.text.upload_progress")}</div>
        <div className="d-flex align-items-center icon-action-container">
          <div
            className="me-50 d-flex align-items-center justify-content-center icon-item"
            onClick={() => handleClickOpenUploadModal()}>
            <i className="fas fa-external-link "></i>
          </div>
          <Fragment>{renderShowUploadContentIcon()}</Fragment>
          <div
            className=" d-flex align-items-center justify-content-center icon-item"
            onClick={() => handleClickCLose()}>
            <i className="fas fa-times"></i>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default NotificationHeader
