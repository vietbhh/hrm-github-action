// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
// ** Components
import WorkspaceManaged from "../components/detail/ListWorkSpace/WorkspaceManaged"
import WorkspaceFilter from "../components/detail/ListWorkSpace/WorkspaceFilter"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const ListWorkspace = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    dataManage: [],
    dataJoined: [],
    filter: {
      text: ""
    }
  })

  const setFilter = (obj) => {
    setState({
      filter: {
        ...state.filter,
        ...obj
      }
    })
  }

  const loadData = () => {
    setState({
      loading: true
    })

    workspaceApi
      .getListWorkspaceSeparateType(state.filter)
      .then((res) => {
        setState({
          dataManage: res.data.data_manage,
          dataJoined: res.data.data_join
        })

        setTimeout(() => {
          setState({
            loading: false
          })
        }, 500)
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
            {useFormatMessage("modules.workspace.title.workgroup")}
            <span className="text-danger">.</span>
          </h1>
        </div>
        <div>
          <WorkspaceFilter filter={state.filter} setFilter={setFilter}/>
        </div>
      </div>
      <div className="body">
        <div>
          <WorkspaceManaged
            workspaceType="manage"
            linkTo="managed"
            loading={state.loading}
            data={state.dataManage}
            showLoadMore={false}
          />
        </div>
        <div>
          <WorkspaceManaged
            workspaceType="joined"
            linkTo="joined"
            loading={state.loading}
            data={state.dataJoined}
            showLoadMore={false}
          />
        </div>
      </div>
    </div>
  )
}

export default ListWorkspace
