// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import {
  setShowUploadNotification,
  openModalUpload
} from "@apps/modules/drive/common/reducer/drive"
// ** Styles
// ** Components
import NotificationHeader from "./NotificationHeader"
import NotificationBody from "./NotificationBody"

const UploadingNotification = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    showUploadContent: true
  })

  const driveState = useSelector((state) => state.drive)
  const {
    listUploadingFile,
    showUploadNotification,
    modalUploadType,
    axiosTokenSource
  } = driveState

  const dispatch = useDispatch()

  const toggleShowUploadContent = () => {
    setState({
      showUploadContent: !state.showUploadContent
    })
  }

  const handleOpenUploadModal = () => {
    dispatch(openModalUpload(modalUploadType))
  }

  // ** render
  const renderNotificationHeader = () => {
    return (
      <NotificationHeader
        showUploadContent={state.showUploadContent}
        listUploadingFile={listUploadingFile}
        axiosTokenSource={axiosTokenSource}
        handleOpenUploadModal={handleOpenUploadModal}
        toggleShowUploadContent={toggleShowUploadContent}
      />
    )
  }

  const renderNotificationBody = () => {
    return (
      <NotificationBody
        listUploadingFile={listUploadingFile}
        showUploadContent={state.showUploadContent}
      />
    )
  }

  const renderComponent = () => {
    if (showUploadNotification === true) {
      return (
        <Fragment>
          <div className="drive-uploading-notification">
            <div className="notification-header">
              <Fragment>{renderNotificationHeader()}</Fragment>
            </div>
            <div>
              <div className="pt-2 notification-body">
                <Fragment>{renderNotificationBody()}</Fragment>
              </div>
            </div>
          </div>
        </Fragment>
      )
    }

    return ""
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default UploadingNotification
