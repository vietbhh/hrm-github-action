// ** React Imports
import { Fragment } from "react"
import { getItemType } from "@apps/modules/drive/common/common"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import FileAndFolderDriveItem from "./FileAndFolderDriveItem"

const ListFileAndFolderDrive = (props) => {
  const {
    // ** props
    classStyle,
    data,
    // ** methods
    handleAfterUpdateFavorite
  } = props

  // ** render
  return (
    <Fragment>
      <div className={`${classStyle}`}>
        <div>
          {_.map(data, (item, index) => {
            return (
              <Col sm={12} key={`recent-file-and-folder-item-${index}`}>
                <FileAndFolderDriveItem
                  index={index}
                  item={{ ...item }}
                  handleAfterUpdateFavorite={handleAfterUpdateFavorite}
                />
              </Col>
            )
          })}
        </div>
      </div>
    </Fragment>
  )
}

export default ListFileAndFolderDrive
