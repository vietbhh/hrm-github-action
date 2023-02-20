// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import WorkspaceManaged from "../components/detail/ListWorkSpace/WorkspaceManaged"
import WorkspaceJoined from "../components/detail/ListWorkSpace/WorkspaceJoined"

const ListWorkspace = (props) => {
  // ** render
  return (
    <div className="pt-0 pe-4 ps-4 pb-1 list-workspace-page">
      <WorkspaceManaged></WorkspaceManaged>
      <WorkspaceJoined></WorkspaceJoined>
    </div>
  )
}

export default ListWorkspace
 