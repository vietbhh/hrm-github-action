// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import FolderTitle from "./FolderTitle"
import DriveFilter from "../DriveFilter/DriveFilter"

const FolderDriveHeader = (props) => {
  const {
    // ** props
    listParentFolder
    // ** methods
  } = props

  // ** render
  const renderFolderTitle = () => {
    return <FolderTitle listParentFolder={listParentFolder} />
  }

  const renderMyFileDriveFilter = () => {
    return <DriveFilter />
  }

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between">
        <div className="w-50 folder-drive-header-title-container">
          <Fragment>{renderFolderTitle()}</Fragment>
        </div>
        <div>
          <Fragment>{renderMyFileDriveFilter()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default FolderDriveHeader
