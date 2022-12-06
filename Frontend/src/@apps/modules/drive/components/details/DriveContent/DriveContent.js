// ** React Imports
import { Fragment } from "react"
// ** redux
import { useSelector } from "react-redux"
// ** Styles
// ** Components
import ListS3Storage from "./S3Storage/ListS3Storage"
import ListDriveFolder from "./DriveFolder/ListDriveFolder"
import ListRecentFileAndFolder from "./RecentFileAndFolder/ListRecentFileAndFolder"
import AvailableStore from "./AvailableStore/AvailabelStore"

const DriveContent = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const driveState = useSelector((state) => state.drive)
  const {listFolder} = driveState

  // ** render
  const renderListS3Storage = () => {
    return <ListS3Storage />
  }

  const renderListDriveFolder = () => {
    return <ListDriveFolder listFolder={listFolder}/>
  }

  const renderListRecentFileAndFolder = () => {
    return <ListRecentFileAndFolder />
  }

  const renderAvailableStore = () => {
    return <AvailableStore />
  }

  return (
    <Fragment>
      <div className="d-flex align-items-start justify-content-between drive-content">
        <div className="w-75">
          <div className="">
            <div className="mb-2 s3-storage-container">
              <Fragment>{renderListS3Storage()}</Fragment>
            </div>
            <div className="mb-2 folder-container">
              <Fragment>{renderListDriveFolder()}</Fragment>
            </div>
            <div className="recent-file-and-folder-container">
              <Fragment>{renderListRecentFileAndFolder()}</Fragment>
            </div>
          </div>
        </div>
        <div className="w-25 available-store-container">
          <Fragment>{renderAvailableStore()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default DriveContent
