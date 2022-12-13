// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import UploadingFileItem from "./UploadingFileItem"
import ListUPloadingFileAndFolder from "../../details/Common/UploadingFileAndFolder/ListUploadingFileAndFolder"

const ListUploadingFile = (props) => {
  const {
    // ** props
    listUploadingFile
    // ** methods
  } = props

  // ** render
  const renderUploadingFileItem = () => {
    return (
      <ListUPloadingFileAndFolder
        uploadingFileAndFolderItem={UploadingFileItem}
        listUploading={listUploadingFile}
      />
    )
  }

  return <Fragment>{renderUploadingFileItem()}</Fragment>
}

export default ListUploadingFile
