// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
// ** Components
import WorkspaceManaged from "../components/detail/ListWorkSpace/WorkspaceManaged"
import WorkspaceFilter from "../components/detail/ListWorkSpace/WorkspaceFilter"

const ListWorkspace = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    dataManage: [],
    dataJoined: [],
    filter: {
      text: ""
    }
  })

  const loadData = () => {
    setState({
      loading: true
    })

    workspaceApi
      .getListWorkspaceSeparateType(state.filter)
      .then((res) => {
        setState({
          dataManage: res.data.data_manage,
          dataJoined: res.data.data_join,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          dataManage: [],
          dataJoined: [],
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.filter])

  // ** render
  return (
    <div className="pt-0 pe-4 ps-4 pb-1 list-workspace-page">
      <div className="d-flex align-items-center justify-content-between header">
        <div>
          <h1 className="title text-color-title">
            {useFormatMessage("modules.workspace.title.workspace")}
            <span className="text-danger">.</span>
          </h1>
        </div>
        <div>
          <WorkspaceFilter />
        </div>
      </div>
      <div className="body">
        <div>
          <WorkspaceManaged
            workspaceType="manage"
            loading={state.loading}
            data={state.dataManage}
          />
        </div>
        <div>
          <WorkspaceManaged
            workspaceType="joined"
            loading={state.loading}
            data={state.dataJoined}
          />
        </div>
      </div>
    </div>
  )
}

export default ListWorkspace
