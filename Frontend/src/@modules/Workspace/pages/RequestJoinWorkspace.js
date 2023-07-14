// ** React Imports
import { useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { Navigate, useParams } from "react-router-dom"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useSelector } from "react-redux"
// ** Styles
// ** Components
import RequestToJoinHeader from "../components/detail/RequestToJoin/RequestToJoinHeader"
import RequestToJoinBody from "../components/detail/RequestToJoin/RequestToJoinBody"
import WorkspaceSettingLayout from "../components/detail/WorkspaceSettingLayout/WorkspaceSettingLayout"

const RequestJoinWorkspace = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    isAdminGroup: false,
    requestJoins: [],
    totalRequestJoin: 0,
    filter: {
      order: "desc",
      text: ""
    }
  })

  const { id } = useParams()

  const userState = useSelector((state) => state.auth.userData)

  const setFilter = (filter) => {
    setState({
      filter: {
        ...state.filter,
        ...filter
      }
    })
  }

  const setRequestJoins = (data) => {
    setState({
      requestJoins: data
    })
  }

  const loadData = () => {
    const params = {
      ...state.filter,
      load_list: "request_join"
    }
    workspaceApi
      .loadDataMember(id, params)
      .then((res) => {
        setState({
          requestJoins: res.data.request_joins,
          totalRequestJoin: res.data.total_request_join,
          isAdminGroup: res.data.is_admin_group,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          loading: false
        })
      })
  }

  // ** effectF
  useEffect(() => {
    loadData()
  }, [state.filter])

  if (!state.isAdminGroup && !state.loading) {
    return <Navigate to="/not-found" replace />
  }
  // ** render
  return (
    <WorkspaceSettingLayout isAdmin={state.isAdminGroup}>
      <div className="workspace request-to-join-container">
        <RequestToJoinHeader
          id={id}
          loading={state.loading}
          totalRequestJoin={state.totalRequestJoin}
          setFilter={setFilter}
          setRequestJoins={setRequestJoins}
        />

        <RequestToJoinBody
          id={id}
          loadingPage={state.loading}
          requestJoins={state.requestJoins}
          setRequestJoins={setRequestJoins}
        />
      </div>
    </WorkspaceSettingLayout>
  )
}

export default RequestJoinWorkspace
