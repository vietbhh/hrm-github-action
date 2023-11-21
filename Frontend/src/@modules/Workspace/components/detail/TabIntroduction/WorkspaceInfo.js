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
      <CardHeader className="pb-0">
        <h6 className="mb-0 info-title">
          <span className="text">
            {useFormatMessage("modules.workspace.display.about_group")}
          </span>
          <span className="text-danger">.</span>
        </h6>
      </CardHeader>
      <CardBody>
        <div className="p-0">
          <div className="about-info p-0">
            <div className="text-section ps-0 mb-75">
              <p className="description mb-0">{workspaceInfo?.description}</p>
            </div>
          </div>
          <WorkspaceTypeInfo workspaceInfo={workspaceInfo} />
          <WorkspaceModeInfo workspaceInfo={workspaceInfo} />
          <div className="workspace-info-item d-flex align-items-start">
            <div className="icon-section">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none">
                <path
                  d="M18.3337 10.0003C18.3337 14.6003 14.6003 18.3337 10.0003 18.3337C5.40033 18.3337 1.66699 14.6003 1.66699 10.0003C1.66699 5.40033 5.40033 1.66699 10.0003 1.66699C14.6003 1.66699 18.3337 5.40033 18.3337 10.0003Z"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.0914 12.6505L10.5081 11.1088C10.0581 10.8421 9.69141 10.2005 9.69141 9.67546V6.25879"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
