// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import WorkspaceManaged from "../components/detail/ListWorkSpace/WorkspaceManaged"

const ListWorkspace = (props) => {
  // ** render
  return (
    <div className="pt-0 pe-4 ps-4 pb-1 list-workspace-page">
      <WorkspaceManaged
        title={useFormatMessage(
          "modules.workspace.title.workspace_that_you_managed"
        )}
        workspaceType="managed"
      />
      <WorkspaceManaged
        title={useFormatMessage(
          "modules.workspace.title.workspace_you_have_joined"
        )}
        workspaceType="joined"
      />
    </div>
  )
}

export default ListWorkspace
