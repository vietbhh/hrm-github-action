// ** React Imports
import { cloneElement, Fragment } from "react"
// ** redux
import { useDispatch, useSelector } from "react-redux"
import { setListUploadingFile } from "@apps/modules/drive/common/reducer/drive"
// ** Styles
// ** Components

const ListUploadingFileAndFolder = (props) => {
  const {
    // ** components
    uploadingFileAndFolderItem,
    // ** props
    listUploadingFile
    // ** methods
  } = props

  const driveState = useSelector((state) => state.drive)
  const { axiosTokenSource } = driveState

  const dispatch = useDispatch()

  const handleCancelUpload = (uid) => {
    const tokenSource = axiosTokenSource[uid]
    tokenSource.cancelTokenSource.cancel()

    const newFile = { ...listUploadingFile[uid], canceled: true }
    dispatch(setListUploadingFile(newFile))
  }

  // ** render
  const renderUploadingFileAndFolderItem = (props) => {
    const UploadingFileAndFolderItem = uploadingFileAndFolderItem

    return <UploadingFileAndFolderItem {...props} />
  }

  return (
    <Fragment>
      {_.map(listUploadingFile, (item, index) => {
        return (
          <Fragment key={`uploading-file-and-folder-item-${index}`}>
            {renderUploadingFileAndFolderItem({
              fileItem: item,
              handleCancelUpload: handleCancelUpload
            })}
          </Fragment>
        )
      })}
    </Fragment>
  )
}

export default ListUploadingFileAndFolder
