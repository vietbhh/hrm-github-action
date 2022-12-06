// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { NavLink as RRNavLink } from "react-router-dom"
// ** Styles
// ** Components

const FolderTitle = (props) => {
  const {
    // ** props
    listParentFolder
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-end">
          <h4 className="mb-0">
            {useFormatMessage("modules.drive.title.my_files")}
          </h4>
          {listParentFolder.map((item, index, arr) => {
            if (index < arr.length - 1) {
              return (
                <span
                  key={`drive-title-item-${index}`}
                  className="ms-50 mb-0 drive-title-item">
                  <i className="fas fa-angle-right me-50" />
                  <RRNavLink to={`drive/folder/${item.id}`}>
                    {item.name}
                  </RRNavLink>
                </span>
              )
            }

            return (
              <span
                key={`drive-title-item-${index}`}
                className="ms-50 mb-0 drive-title-item">
                <i className="fas fa-angle-right me-50" /> {item.name}
              </span>
            )
          })}
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default FolderTitle
