// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import DriveFilter from "../DriveFilter/DriveFilter"

const MyFileDriveHeader = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  const renderMyFileDriveFilter = () => {
    return <DriveFilter />
  }

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h4 className="mb-0">{useFormatMessage("modules.drive.title.my_files")}</h4>
        </div>
        <div>
          <Fragment>{renderMyFileDriveFilter()}</Fragment>
        </div>
      </div> 
    </Fragment>
  )
}

export default MyFileDriveHeader
