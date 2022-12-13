// ** React Imports
import { Fragment } from "react"
import { getFileAndFolderIcon, formatBytes } from "@apps/modules/drive/common/common"
// ** Styles
import { Progress } from "antd"
// ** Components

const FileUploadItem = (props) => {
  const {
    // ** props
    fileItem
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div className="d-flex align-items-center mb-1 w-100">
        <div className="d-flex align-items-center justify-content-center me-75 drive-icon-bg-md">
            {getFileAndFolderIcon(fileItem.type)}
        </div>
        <div className="w-100">
          <div className="d-flex align-items-center justify-content-between w-auto upload-detail">
            <div className="content-name w-75">{fileItem.name}</div>
            <div>{formatBytes(fileItem.size)}</div>
          </div>
          <div>
          <Progress showInfo={false} percent={fileItem.progress} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default FileUploadItem
