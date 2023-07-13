// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
import moment from "moment"
// ** Styles
import { Card, CardBody, CardHeader } from "reactstrap"
// ** Components

const WorkspaceInfo = (props) => {
  const {
    // ** props
    workspaceInfo
    // ** methods
  } = props

  // ** render
  const renderType = () => {
    if (workspaceInfo?.type === undefined) {
      return ""
    }

    let icon = "fa-regular fa-earth-asia"
    if (workspaceInfo.type === "private") {
      icon = "fa-regular fa-lock"
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

  const renderMode = () => {
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

  return (
    <Card className="workspace-info-container">
      <CardHeader className="pb-1">
        <h6 className="mb-0 info-title">
          <span className="text">{useFormatMessage("common.information")}</span>
          <span className="text-danger">.</span>
        </h6>
      </CardHeader>
      <CardBody>
        <div className="p-0 pt-25">
          <Fragment>{renderType()}</Fragment>
          <Fragment>{renderMode()}</Fragment>

          <div className="workspace-info-item d-flex align-items-start">
            <div className="icon-section">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                width="19px"
                height="19px"
                viewBox="0 0 19 19"
                enableBackground="new 0 0 19 19"
                xmlSpace="preserve">
                {" "}
                <image
                  id="image0"
                  width="19"
                  height="19"
                  x="0"
                  y="0"
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAMAAABFjsb+AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAbFBMVEUAAACPl5ePlZ2PlpyP lZqPk5uTlp+Slp+SlZ2Slp+SlJ+SlZ+Ulp+Tlp6Tk5+Ul5+Pl5uPlZ+TlpyPj5+TlZ+Pj5+Xl5+T lp+Tk5yPl5+SlJ2Slp+VlZ+Tl5+Tl5+TlZ6Slp6Tlp+Tlp////+CosnSAAAAInRSTlMAIGBQMEC/ 32CPj2DfoECfQDBQEO8gIM9QIHBwML9AkMBQcssH7QAAAAFiS0dEIypibDoAAAAJcEhZcwAACxMA AAsTAQCanBgAAAAHdElNRQfnBwQGFCt8SJh6AAAAgUlEQVQY033Q6RKCIBAAYCQTCpNOrxR03/8h Yxclicn9w/Ixwx6M/Y+M80MeybEADCG/dII1zikFVHQpLx4rMkG5vnorkG4QGWTO7j8mw3egH6k9 X3VDSeusW95Fz954DlhkhKDYE/ViYBvLeHZDdh3OpuRqlySTibY1zErVO/v9AMSiGLgjupsSAAAA JXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTA0VDA0OjIwOjQzKzAyOjAwLJUDxQAAACV0RVh0ZGF0 ZTptb2RpZnkAMjAyMy0wNy0wNFQwNDoyMDo0MyswMjowMF3Iu3kAAAAASUVORK5CYII="
                />
              </svg>
            </div>
            <div className="text-section">
              <h5 className="mb-0 title">
                {useFormatMessage(
                  `modules.workspace.text.work_space_description.history.title`
                )}
              </h5>
              <p className="mb-0 description">
                {`${useFormatMessage(
                  `modules.workspace.text.work_space_description.history.group_crated_date`
                )} - ${moment(workspaceInfo.crated_at).format("DD/MM/YYYY")}`}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default WorkspaceInfo
