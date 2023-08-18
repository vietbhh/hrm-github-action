// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
// ** Components

const WorkspaceTypeInfo = (props) => {
  const {
    // ** props
    workspaceInfo
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    if (workspaceInfo?.type === undefined) {
      return ""
    }

    return (
      <div className="d-flex align-items-start workspace-info-item">
        <div className="icon-section">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="16px"
            height="15px"
            viewBox="0 0 16 15"
            enableBackground="new 0 0 16 15"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="16"
              height="15"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAdVBMVEUAAACPj5+TlZ+Tlp+S lZ+Tlp+SlZ+Pj5+Pj5+Slp+TlZ+Ulp+Slp6Xl5+SlZ+Tl5+UlZ+Slp+SlJ2SlZ+Tk5+RlZ2Tk5+T lp+RlJ6fn5+Pl5+Ulp+SlJ+SlZ6Tk5yPlpySlZ2VlZ+Pl5uTlZ6Tl56Tlp////8hEEMFAAAAJXRS TlMAEH+/78+fIDDf78/AIGBAn3Bwr0CAgK+gECDfj+BQUGAwQJCQye5pDwAAAAFiS0dEJloImLUA AAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwQGGSa3V5qKAAAAkklEQVQI1z1O7RKCMAwr 6MBNNhRBVEREzfu/ogly9kfzcWmuZpws32zhitLW2fmAfQCQrxpVTLGmgYN06SvBUQYasoQo+yQd AqlDy91Jn2txwGdtf5FxtdDYjcS1zSDjbmOnhGhM8gom2KHhbVxxqcPDbCIM+ns592ae8NRL8xKZ X1zv3++zMr37a9alChg/tfgXGK4SBnvFku8AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMDRU MDQ6MjU6MzgrMDI6MDDCfpViAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA3LTA0VDA0OjI1OjM4 KzAyOjAwsyMt3gAAAABJRU5ErkJggg=="
            />
          </svg>
        </div>
        <div className="text-section">
          <h5 className="mb-0 title">
            {useFormatMessage(
              `modules.workspace.text.work_space_description.type.${workspaceInfo.type}.title`
            )}
          </h5>
          <p className="mb-0 description">
            {useFormatMessage(
              `modules.workspace.text.work_space_description.type.${workspaceInfo.type}.description`
            )}
          </p>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default WorkspaceTypeInfo
