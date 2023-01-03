// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import MyFileDriveHeader from "../components/details/MyFileDrive/MyFileDriveHeader"
import ListFileAndFolderDrive from "../components/details/MyFileDrive/ListFileAndFolderDrive"

const MyFileDrive = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  const renderMyFileDriveHeader = () => {
    return <MyFileDriveHeader />
  }

  const renderListFileAndFolderDrive = () => {
    return <ListFileAndFolderDrive />
  }

  return (
    <Fragment>
      <div className="ps-4 pt-2 pe-4 my-file-drive-page">
        <div className="mb-4 my-file-drive-header-container">
          <Fragment>{renderMyFileDriveHeader()}</Fragment>
        </div>
        <div className="list-file-and-folder-container">
          <Fragment>{renderListFileAndFolderDrive()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default MyFileDrive
