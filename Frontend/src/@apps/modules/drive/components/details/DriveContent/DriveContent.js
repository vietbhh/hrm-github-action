// ** React Imports
import { Fragment } from "react"
// ** redux
import { useDispatch, useSelector } from "react-redux"
import { setRecentFileAndFolder } from "@apps/modules/drive/common/reducer/drive"
// ** Styles
// ** Components
import ListS3Storage from "./S3Storage/ListS3Storage"
import ListDriveFolder from "./DriveFolder/ListDriveFolder"
import ListRecentFileAndFolder from "./RecentFileAndFolder/ListRecentFileAndFolder"
import AvailableStore from "./AvailableStore/AvailabelStore"

const DriveContent = (props) => {
  const {
    // ** props
    loadingRecentFileAndFolder,
    recentFileAndFolder,
    // ** methods
    handleAfterUpdateFavorite
  } = props

  const driveState = useSelector((state) => state.drive)
  const { listFolder } = driveState

  // ** render
  return (
    <Fragment>
      <div className="d-flex align-items-start justify-content-between drive-content">
        <div className="w-75">
          <div className="">
            <div className="mb-2 s3-storage-container">
              <ListS3Storage />
            </div>
            <div className="mb-2 folder-container">
              <ListDriveFolder listFolder={listFolder} />
            </div>
            <div className="recent-file-and-folder-container">
              <ListRecentFileAndFolder
                loadingRecentFileAndFolder={loadingRecentFileAndFolder}
                recentFileAndFolder={recentFileAndFolder}
                handleAfterUpdateFavorite={handleAfterUpdateFavorite}
              />
            </div>
          </div>
        </div>
        <div className="w-25 available-store-container">
          <AvailableStore />
        </div>
      </div>
    </Fragment>
  )
}

export default DriveContent
