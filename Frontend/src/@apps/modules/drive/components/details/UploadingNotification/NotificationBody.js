// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import UploadingFileAndFolderItem from "./UploadingFileAndFolderItem"
import ListUploadingFileAndFolder from "../Common/UploadingFileAndFolder/ListUploadingFileAndFolder"

const NotificationBody = (props) => {
  const {
    // ** props
    listUploadingFile,
    showUploadContent
    // ** methods
  } = props

  // ** render
  const renderListUploadingFileAndFolder = () => {
    return (
      <ListUploadingFileAndFolder
        uploadingFileAndFolderItem={UploadingFileAndFolderItem}
        listUploadingFile={listUploadingFile}
      />
    )
  }

  const renderComponent = () => {
    if (showUploadContent === true) {
      return <Fragment>{renderListUploadingFileAndFolder()}</Fragment>
    }

    return ""
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default NotificationBody
