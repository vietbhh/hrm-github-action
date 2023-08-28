// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
// ** Components

const WorkspaceModeInfo = (props) => {
  const {
    // ** props
    workspaceInfo
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    if (workspaceInfo?.mode === undefined) {
      return ""
    }

    let icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="19px"
        height="13px"
        viewBox="0 0 19 13"
        enableBackground="new 0 0 19 13"
        xmlSpace="preserve">
        {" "}
        <image
          id="image0"
          width="19"
          height="13"
          x="0"
          y="0"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAANCAMAAAB8UqUVAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAb1BMVEUAAACPlZqPlZ2Pk5uP j5+TlZ+SlZ+Slp+SlZ+Pj5+TlZ+Tlp6RlZ2SlZ6Tk5+Ulp6Ulp+Xl5+RlZ6Tl5+RlJ6Tlp+Pl5+S lZ6Pl5eUl5+SlZ6Tl56fn5+SlZ+VlZ+Tl5+Tlp+TlZ+VlZ+Tlp////8qm9SEAAAAI3RSTlMAMGBA EH/v358g76CAsEBf3yCQv6C/IOAgn8CQEGBgQK+AMEB774EAAAABYktHRCS0BvmZAAAACXBIWXMA AAsTAAALEwEAmpwYAAAAB3RJTUUH5wcEBi4pt+8nLwAAAJFJREFUGNNNT9kSwiAQWylKOWpZPGq1 iMf//6MbsDPdh0zIkGyWqM1OKdXRZvT+8MWY3q5SJ4rzYYB6bNIoPLIQjsJGSBY+1sn0mp0YYD+J NNBZMJEXvBBdER5oQhgFPG7t30ypItbckVxDtJ8eixXJYRtl2JBsjbBnK1PQ4RVm1Cxrafax3uHe y/a8knP+/PkPHesPCsLbQIYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMDRUMDQ6NDY6NDEr MDI6MDBeoajoAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA3LTA0VDA0OjQ2OjQxKzAyOjAwL/wQ VAAAAABJRU5ErkJggg=="
        />
      </svg>
    )
    if (workspaceInfo.type === "hidden") {
      icon = <i className="fas fa-eye-slash" />
    }

    return (
      <div className="workspace-info-item d-flex align-items-start">
        <div className="icon-section">{icon}</div>
        <div className="text-section">
          <h5 className="title">
            {useFormatMessage(
              `modules.workspace.text.work_space_description.mode.${workspaceInfo.mode}.title`
            )}
          </h5>
          <p className="mb-0 description">
            {useFormatMessage(
              `modules.workspace.text.work_space_description.mode.${workspaceInfo.mode}.description`
            )}
          </p>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default WorkspaceModeInfo
