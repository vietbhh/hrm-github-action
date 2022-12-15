// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { _getUploadProcess } from "@apps/modules/drive/common/common"
// ** redux
import { useDispatch } from "react-redux"
import { resetDriveState } from "@apps/modules/drive/common/reducer/drive"
// ** Styles
// ** Components
import { Space } from "antd"
import SwAlert from "@apps/utility/SwAlert"


const NotificationHeader = (props) => {
  const {
    // ** props
    showUploadContent,
    listUploadingFile,
    axiosTokenSource,
    // ** methods
    handleOpenUploadModal,
    toggleShowUploadContent
  } = props

  const dispatch = useDispatch()

  const handleClickOpenUploadModal = () => {
    handleOpenUploadModal()
  }

  const resetNotificationState = () => {
    dispatch(
      resetDriveState([
        "axiosTokenSource",
        "listUploadingFile",
        "isUploadingFileAndFolder",
        "showUploadNotification"
      ])
    )
  }

  const handleClickCLose = () => {
    const isUploadComplete = _getUploadProcess(listUploadingFile)

    if (isUploadComplete) {
      resetNotificationState()
      return false
    }

    SwAlert.showWarning({
      title: useFormatMessage("modules.drive.text.warning_close_upload.title"),
      text: useFormatMessage("modules.drive.text.warning_close_upload.content")
    }).then((res) => {
      if (res.isConfirmed === true) {
        _.map(axiosTokenSource, (item, index) => {
          item.cancelTokenSource.cancel()
        })
      }

      resetNotificationState()
    })
  }

  const handleToggleUploadContent = () => {
    toggleShowUploadContent()
  }

  // ** render
  const renderShowUploadContentIcon = () => {
    return (
      <Fragment>
        <div
          className="me-50 d-flex align-items-center justify-content-center icon-item"
          onClick={() => handleToggleUploadContent()}>
          {showUploadContent ? (
            <i className="fas fa-angle-down "></i>
          ) : (
            <i className="fas fa-angle-up "></i>
          )}
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
