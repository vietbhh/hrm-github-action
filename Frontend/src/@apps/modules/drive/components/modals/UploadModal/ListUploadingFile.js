// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import UploadingFileAndFolderItem from "./UploadingFileAndFolderItem"
import ListUPloadingFileAndFolder from "../../details/Common/UploadingFileAndFolder/ListUploadingFileAndFolder"

const ListUploadingFile = (props) => {
  const {
    // ** props
    listUploadingFile
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    return (
      <ListUPloadingFileAndFolder
        uploadingFileAndFolderItem={UploadingFileAndFolderItem}
        listUploadingFile={listUploadingFile}
      />
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListUploadingFile
