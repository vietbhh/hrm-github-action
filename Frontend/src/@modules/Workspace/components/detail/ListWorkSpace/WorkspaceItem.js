// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import defaultWorkSpaceCover from "@modules/Workspace/assets/images/default_workspace_cover.webp"
import Avatar from "@apps/modules/download/pages/Avatar"

const WorkspaceItem = (props) => {
  const {
    // ** props
    workspaceType,
    item
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    if (workspaceType === "manage") {
      return (
        <div className="workspace-item common-border">
          <div className="mb-25 image-container">
            <img src={defaultWorkSpaceCover} />
          </div>
          <div className="p-1 content-container">
            <div className="mb-1">
              <p className="mb-50 text-color-title">Dribble Designer Pro ID</p>
              <small>Public - 2.351 Members</small>
            </div>
            <div className="btn-container">
              <Button.Ripple
                color="secondary"
                className="custom-secondary common-border">
                {useFormatMessage("modules.workspace.buttons.view_workspace")}
              </Button.Ripple>
            </div>
          </div>
        </div>
      )
    } else if (workspaceType === "joined") {
      return (
        <div className="d-flex align-items-center justify-content-between workspace-item">
          <div className="me-50 image-container">
            <img src={defaultWorkSpaceCover} />
          </div>
          <div className="p-75 d-flex align-items-center justify-content-between gap-1 content-container common-border">
            <div>
              <div className="mb-25">
                <p className="mb-0 text-color-title">
                  Dribble Designer Pro ID
                </p>
                <small>Public - 2.351 Members</small>
              </div>
              <div className="member-container">
                <div className="d-flex align-items-center">
                  <Avatar imgWidth={18} imgHeight={18} className="me-25" />
                  <Avatar imgWidth={18} imgHeight={18} className="me-25" />
                  <Avatar imgWidth={18} imgHeight={18} className="me-25" />
                  <p className="mb-0 me-25 ps-25 pe-25 rest-number">+3</p>
                  <p className="mb-0 mt-0 joined-time">Joined in 17/02/2000</p>
                </div>
              </div>
            </div>
            <div className="btn-container">
              <Button.Ripple
                color="secondary"
                className="custom-secondary common-border">
                {useFormatMessage("modules.workspace.buttons.view_workspace")}
              </Button.Ripple>
            </div>
          </div>
        </div>
      )
    }
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default WorkspaceItem
