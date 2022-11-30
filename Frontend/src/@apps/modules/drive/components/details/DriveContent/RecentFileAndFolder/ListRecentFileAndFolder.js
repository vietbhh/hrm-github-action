// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import ItemRecentFileAndFolder from "./ItemRecentFileAndFolder"

const ListRecentFileAndFolder = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const mockData = [
    {
      type: "file",
      name: "My report.docx",
      file_extension: "docx",
      file_size: 7
    },
    {
      type: "file",
      name: "Backsound.mp3",
      file_extension: "mp3",
      file_size: 5.6
    },
    {
      type: "file",
      name: "Artboard-1.png",
      file_extension: "png",
      file_size: 5.6
    },
    {
      type: "file",
      name: "Final Present.mp4",
      file_extension: "mp4",
      file_size: 154
    },
    {
      type: "folder",
      name: "Work",
      total_size: 162816
    }
  ]

  // ** render
  const renderListRecentFileAndFolder = () => {
    return (
      <Fragment>
        <Row>
          {mockData.map((item, index) => {
            return (
              <Col sm={12} key={`recent-file-and-folder-item-${index}`}>
                <ItemRecentFileAndFolder item={item} />
              </Col>
            )
          })}
        </Row>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div>
        <div className="mb-1">
          <h4>{useFormatMessage("modules.drive.title.recent")}</h4>
        </div>
        <div>
            <Fragment>{renderListRecentFileAndFolder()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default ListRecentFileAndFolder
