// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useParams } from "react-router-dom"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useSelector } from "react-redux"
// ** Styles
// ** Components
import RequestToJoin from "../components/detail/TabMember/RequestToJoin"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import { Card, CardBody } from "reactstrap"

const RequestJoinWorkspace = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    isAdminGroup: false,
    requestJoins: [],
    totalRequestJoin: 0,
    filter: {
      page: 1,
      limit: 30
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

  // ** render
  const renderContent = () => {
    if (state.loading) {
      return ""
    }

    if (state.requestJoins.length === 0) {
      return (
        <Card>
          <CardBody>
            <h6 className="mb-2">
              {useFormatMessage("modules.workspace.display.request_to_join")}
            </h6>
            <EmptyContent />
          </CardBody>
        </Card>
      )
    }

    return (
      <RequestToJoin
        id={id}
        isFullPage={true}
        currentPage={state.filter.page}
        perPage={state.filter.limit}
        totalRecord={state.totalRequestJoin}
        isAdminGroup={state.isAdminGroup}
        requestJoins={state.requestJoins}
        userState={userState}
        setFilter={setFilter}
        setRequestJoins={setRequestJoins}
        loadData={loadData}
      />
    )
  }

  return (
    <div className="workspace">
      <Fragment>{renderContent()}</Fragment>
    </div>
  )
}

export default RequestJoinWorkspace
