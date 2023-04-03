// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useEffect } from "react"
// ** Styles
// ** Components
import WorkspaceManaged from "../../../../Workspace/components/detail/ListWorkSpace/WorkspaceManaged"

const Workspace = () => {
  // ** render
  return (
    <div className="pt-0 pe-4 ps-4 pb-1 list-workspace-page">
      <WorkspaceManaged
        title={useFormatMessage(
          "modules.workspace.title.workspace_you_have_joined"
        )}
        workspaceType="both"
        customLimit={12}
      />
    </div>
  )
}

export default Workspace
