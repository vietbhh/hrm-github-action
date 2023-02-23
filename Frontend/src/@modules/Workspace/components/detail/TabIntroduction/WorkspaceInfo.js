// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
import moment from "moment"
// ** Styles
import { Card, CardBody } from "reactstrap"
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
      <div className="workspace-info-item">
        <h5>
          <i className={`${icon} me-50`} />
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
    )
  }

  const renderMode = () => {
    if (workspaceInfo?.mode === undefined) {
      return ""
    }

    let icon = "fa-regular fa-eye"
    if (workspaceInfo.type === "hidden") {
      icon = "fa-regular fa-eye-slash"
    }

    return (
      <div className="workspace-info-item">
        <h5>
          <i className={`${icon} me-50`} />
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
    )
  }

  return (
    <Card className="workspace-info-container">
      <CardBody>
        <Fragment>{renderType()}</Fragment>
        <Fragment>{renderMode()}</Fragment>

        <div className="workspace-info-item">
          <h5>
            <i className="fas fa-clock me-50" />
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
      </CardBody>
    </Card>
  )
}

export default WorkspaceInfo
