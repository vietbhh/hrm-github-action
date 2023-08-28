// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
import moment from "moment"
// ** Styles
import { Card, CardBody, CardHeader } from "reactstrap"
// ** Components
import WorkspaceTypeInfo from "./WorkspaceTypeInfo"
import WorkspaceModeInfo from "./WorkspaceModeInfo"

const WorkspaceInfo = (props) => {
  const {
    // ** props
    workspaceInfo
    // ** methods
  } = props

  // ** render
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
          <WorkspaceTypeInfo workspaceInfo={workspaceInfo} />
          <WorkspaceModeInfo workspaceInfo={workspaceInfo} />

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
