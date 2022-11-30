// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import ItemDriveFolder from "./ItemDriveFolder"

const ListDriveFolder = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const mockData = [
    {
      title: "Project A",
      file_number: 15
    },
    {
      title: "Marketing",
      file_number: 150
    },
    {
      title: "Finance",
      file_number: 200
    }
  ]

  // ** render
  const renderListFolder = () => {
    return (
      <Fragment>
        <Row>
          {mockData.map((item, index) => {
            return <Col sm={4} key={`item-drive-folder-${index}`}>
                <ItemDriveFolder folderItem={item}/>
            </Col>
          })}
        </Row>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div>
        <div className="d-flex justify-content-between mb-1">
          <h4>{useFormatMessage("modules.drive.title.folders")}</h4>
          <small>{useFormatMessage("modules.drive.text.view_all")}</small>
        </div>
        <div>
          <Fragment>{renderListFolder()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default ListDriveFolder
