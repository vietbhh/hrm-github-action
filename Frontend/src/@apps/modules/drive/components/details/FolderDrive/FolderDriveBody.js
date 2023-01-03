// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import ListFileAndFolderDrive from "../Common/ListFileAndFolderDrive/ListFileAndFolderDrive"

const FolderDriveBody = (props) => {
  const {
    // ** props
    listFileAndFolder
    // ** methods
  } = props

  // ** render
  const renderListFileAndFolderDrive = () => {
    return <ListFileAndFolderDrive data={listFileAndFolder} className={""} />
  }

  return (
    <Fragment>
      <div className="list-file-and-folder-container">
        <Fragment>{renderListFileAndFolderDrive()}</Fragment>
      </div>
    </Fragment>
  )
}

export default FolderDriveBody
