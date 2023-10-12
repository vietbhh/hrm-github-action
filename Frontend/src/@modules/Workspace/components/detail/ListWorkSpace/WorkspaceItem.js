// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, addComma } from "@apps/utility/common"
import { useNavigate } from "react-router-dom"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import defaultWorkSpaceCover from "@modules/Workspace/assets/images/default_workspace_cover.webp"
import ListMember from "./ListMember"
import Photo from "@apps/modules/download/pages/Photo"
import { Tooltip } from "antd"

const WorkspaceItem = (props) => {
  const {
    // ** props
    workspaceType,
    infoWorkspace
    // ** methods
  } = props

  const navigate = useNavigate()

  const handleClickViewGroup = () => {
    navigate(`/workspace/${infoWorkspace.id}`)
  }

  // ** render
  const renderJoinDate = () => {
    if (Object.keys(infoWorkspace.current_member_join) > 0) {
      return (
        <Fragment>
          {useFormatMessage("modules.workspace.text.joined_date")}{" "}
          {infoWorkspace.current_member_join?.date}
        </Fragment>
      )
    }

    return ""
  }

  const renderCoverImage = () => {
    if (infoWorkspace.cover_image) {
      return (
        <Photo
          src={infoWorkspace.cover_image}
          className=" w-100"
          preview={false}
        />
      )
    }

    return <img src={defaultWorkSpaceCover} />
  }

  const renderComponent = () => {
    if (workspaceType === "manage") {
      return (
        <div className="workspace-item common-border">
          <div
            className="mb-25 image-container"
            onClick={() => handleClickViewGroup()}>
            <Fragment>{renderCoverImage()}</Fragment>
          </div>
          <div className="p-1 content-container">
            <div className="mb-1">
              <Tooltip placement="top" title={infoWorkspace.name} style={{backgroundColor:"yellow"}}>
                  <p className="mb-0 text-color-title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} onClick={() => handleClickViewGroup()}>
                    {infoWorkspace.name}
                  </p>
              </Tooltip>
              <small>
                {infoWorkspace.type} • {addComma(infoWorkspace.member_number)}{" "}
                {infoWorkspace.member_number === 1
                  ? useFormatMessage("modules.workspace.display.member")
                  : useFormatMessage("modules.workspace.display.members")}
              </small>
            </div>
            <div className="btn-container">
              <Button.Ripple
                color="secondary"
                className="custom-secondary common-border"
                onClick={() => handleClickViewGroup()}>
                {useFormatMessage("modules.workspace.buttons.view_group")}
              </Button.Ripple>
            </div>
          </div>
        </div>
      )
    } else if (workspaceType === "joined") {
      return (
        <div className="d-flex align-items-center justify-content-between workspace-item">
          <div className="me-50 image-container common-border">
            <Fragment>{renderCoverImage()}</Fragment>
          </div>
          <div className="p-75 d-flex align-items-center justify-content-between gap-1 content-container common-border">
            <div style={{ flex: "3", overflow: "hidden" }}>
              <div className="mb-25">
                <Tooltip placement="top" title={infoWorkspace.name} style={{backgroundColor:"yellow"}}>
                  <p className="mb-0 text-color-title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {infoWorkspace.name}
                  </p>
                </Tooltip>
                <small>
                  {infoWorkspace.type} • {addComma(infoWorkspace.member_number)}{" "}
                  {infoWorkspace.member_number === 1
                    ? useFormatMessage("modules.workspace.display.member")
                    : useFormatMessage("modules.workspace.display.members")}
                </small>
              </div>
              <div className="member-container">
                <div className="d-flex align-items-center">
                  <ListMember
                    workspaceId={infoWorkspace.id}
                    listMember={infoWorkspace.members}
                    memberNumber={infoWorkspace.member_number}
                  />
                  <p className="mb-0 mt-0 joined-time">
                    <Fragment>{renderJoinDate()}</Fragment>
                  </p>
                </div>
              </div>
            </div>
            <div className="btn-container">
              <Button.Ripple
                color="secondary"
                className="custom-secondary common-border"
                onClick={() => handleClickViewGroup()}
              >
                {useFormatMessage("modules.workspace.buttons.view_group")}
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
