// ** React Imports
import { Fragment } from "react"
import {
  getFileAndFolderIcon,
  formatBytes
} from "@apps/modules/drive/common/common"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Card, CardBody, Row, Col } from "reactstrap"
// ** Components
import ActionFileAndFolder from "./ActionFileAndFolder"

const FileAndFolderDriveItem = (props) => {
  const {
    // ** props
    index,
    item,
    // ** methods
    handleAfterUpdateFavorite
  } = props

  // ** render
  const renderExtension = () => {
    if (item.type === "folder") {
      return (
        <Fragment>{useFormatMessage("modules.drive.text.folder")}</Fragment>
      )
    }

    return (
      <Fragment>{`${item.file_type.toUpperCase()} ${useFormatMessage(
        "modules.drive.text.file"
      )}`}</Fragment>
    )
  }

  const renderSize = () => {
    if (item.type === "folder") {
      return <Fragment>{formatBytes(item.total_size)}</Fragment>
    }

    return <Fragment>{formatBytes(item.file_size)}</Fragment>
  }

  return (
    <Fragment>
      <Card className="recent-file-and-folder-item mb-25">
        <CardBody className="p-1">
          <Row>
            <Col sm={1}>
              <div className="d-flex align-items-center justify-content-center me-2 icon-file-and-folder">
                {getFileAndFolderIcon(item.type, item?.file_type)}
              </div>
            </Col>
            <Col sm={4} className="d-flex align-items-center">
              <Fragment>{item.name}</Fragment>
            </Col>
            <Col sm={3} className="d-flex align-items-center">
              <p className="mb-0 extension-file-and-folder">
                <Fragment>{renderExtension()}</Fragment>
              </p>
            </Col>
            <Col sm={3} className="d-flex align-items-center">
              <p className="mb-0 size-file-and-folder">
                <Fragment>{renderSize()}</Fragment>
              </p>
            </Col>
            <Col sm={1} className="d-flex align-items-center">
              <ActionFileAndFolder
                index={index}
                item={item}
                handleAfterUpdateFavorite={handleAfterUpdateFavorite}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default FileAndFolderDriveItem
