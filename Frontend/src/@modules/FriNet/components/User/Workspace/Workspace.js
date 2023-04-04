// ** React Imports
// ** Styles
// ** Components
import WorkspaceManaged from "../../../../Workspace/components/detail/ListWorkSpace/WorkspaceManaged"

const Workspace = (props) => {
  const {
    // ** props
    identity,
    employeeData
    // ** methods
  } = props

  const isProfile = employeeData.is_profile

  // ** render
  return (
    <div className="pt-0 pb-1 list-workspace-page">
      <WorkspaceManaged
        title={undefined}
        workspaceType="both"
        customLimit={12}
        customUserId={isProfile ? undefined : identity}
      />
    </div>
  )
}

export default Workspace
