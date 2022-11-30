// ** React Imports
import { Fragment } from "react"
import { getFileAndFolderIcon } from "../../../../common/common"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody, Row, Col } from "reactstrap"
// ** Components
import ActionFileAndFolder from "../ActionFileAndFolder"

const ItemRecentFileAndFolder = (props) => {
  const {
    // ** props
    item
    // ** methods
  } = props

  // ** render
  const renderExtension = () => {
    if (item.type === "folder") {
      return (
        <Fragment>{useFormatMessage("modules.drive.text.folder")}</Fragment>
      )
    }

    return (
      <Fragment>{`${item.file_extension.toUpperCase()} ${useFormatMessage(
        "modules.drive.text.file"
      )}`}</Fragment>
    )
  }

  const renderSize = () => {
    if (item.type === "folder") {
      return <Fragment>{Math.floor(item.total_size / 1024)} GB</Fragment>
    }

    return <Fragment>{item.file_size} MB</Fragment>
  }

  const renderAction = () => {
    return <ActionFileAndFolder />
  }

  return (
    <Fragment>
      <Card className="recent-file-and-folder-item mb-25">
        <CardBody className="p-1">
          <Row>
            <Col sm={1}>
              <div className="d-flex align-items-center justify-content-center me-2 icon-file-and-folder">
                {getFileAndFolderIcon(item.type, item?.file_extension)}
              </div>
            </Col>
            <Col sm={4} className="d-flex align-items-center">
              <h6 className="mb-0 name-file-and-folder">{item.name}</h6>
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
              <Fragment>{renderAction()}</Fragment>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ItemRecentFileAndFolder
