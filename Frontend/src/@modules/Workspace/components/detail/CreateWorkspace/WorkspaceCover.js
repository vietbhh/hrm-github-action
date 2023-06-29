// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Components
import defaultWorkspaceCover from "../../../assets/images/default_workspace_cover.webp"
import Photo from "@apps/modules/download/pages/Photo"

const WorkspaceCover = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <div className="image-cover">
      <img
        src={defaultWorkspaceCover}
        width="100%"
        className="w-100 workspaceCover"
      />
    </div>
  )
}

export default WorkspaceCover
