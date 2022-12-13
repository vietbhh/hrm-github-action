// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { NavLink as RRNavLink } from "react-router-dom"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import ItemDriveFolder from "./ItemDriveFolder"

const ListDriveFolder = (props) => {
  const {
    // ** props
    listFolder
    // ** methods
  } = props

  const dataFolder = []
  listFolder.map((item, index) => {
    if (index < 3) {
      dataFolder.push({
        id: item.id,
        title: item.name,
        file_number: item?.file_number === undefined ? 0 : item.file_number
      })
    }
  })

  // ** render
  const renderListFolder = () => {
    if (dataFolder.length === 0) {
      return ""
    } 

    return (
      <Fragment>
        <Row>
          {dataFolder.map((item, index) => {
            return (
              <Col sm={4} key={`item-drive-folder-${index}`}>
                <ItemDriveFolder folderItem={item} />
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
        <div className="d-flex justify-content-between mb-1">
          <h4>{useFormatMessage("modules.drive.title.folders")}</h4>
          <RRNavLink to={`/drive/my-file`}>
            <small>{useFormatMessage("modules.drive.text.view_all")}</small>
          </RRNavLink>
        </div>
        <div>
          <Fragment>{renderListFolder()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default ListDriveFolder
