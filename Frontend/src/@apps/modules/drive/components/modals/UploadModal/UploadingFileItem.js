// ** React Imports
import { Fragment } from "react"
import { getFileAndFolderIcon, formatBytes } from "@apps/modules/drive/common/common"
// ** Styles
import { Progress } from "antd"
// ** Components
import UploadStatusIcon from "./UploadStatusIcon"

const UploadingFileItem = (props) => {
  const {
    // ** props
    fileItem
    // ** methods
  } = props

  const fileType =
    fileItem.type !== undefined ? fileItem.type.split("/").shift() : ""

  // ** render
  const renderUploadStatusIcon = () => {
    return <UploadStatusIcon fileItem={fileItem} />
  }

  return (
    <Fragment>
      <div className="uploading-file-item mb-2">
        <div className="d-flex align-items-center justify-content-between mb-50">
          <div className="d-flex align-items-center w-30">
            <div className="d-flex align-items-center justify-content-center drive-icon-bg me-2">
              {getFileAndFolderIcon("file", fileType)}
            </div>
            <p className="mb-0">{fileItem.name}</p>
          </div>
          <div>{formatBytes(fileItem.size)}</div>
          <div>
            <Fragment>{renderUploadStatusIcon()}</Fragment>
          </div>
        </div>
        <div>
          <Progress showInfo={false} percent={fileItem.progress} />
        </div>
      </div>
    </Fragment>
  )
}

export default UploadingFileItem
