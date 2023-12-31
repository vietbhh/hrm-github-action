// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
import { Button, Col, Spinner } from "reactstrap"
import { Row } from "antd"
// ** Components
import WorkspaceManaged from "../components/detail/ListWorkSpace/WorkspaceManaged"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useDispatch } from "react-redux"
import { setAppTitle } from "../../../redux/app/app"

const WorkspaceManagedPage = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    loadingPaginate: true,
    data: [],
    totalPage: 0,
    showLoadMore: true,
    disableLoadMore: false,
    filter: {
      page: 1,
      limit: 12
    }
  })

  const loadData = () => {
    const params = {
      ...state.filter,
      workspace_type: "managed"
    }

    workspaceApi
      .getList(params)
      .then((res) => {
        setTimeout(() => {
          setState({
            data: [...state.data, ...res.data.results],
            totalPage: res.data.total_page,
            loading: false,
            loadingPaginate: false
          })
        }, 300)
      })
      .catch((err) => {
        setState({
          data: [],
          totalPage: 0,
          loading: false,
          loadingPaginate: false
        })
      })
  }

  const handleCLickLoadMore = () => {
    setState({
      loadingPaginate: true,
      filter: {
        ...state.filter,
        page: state.filter.page + 1
      }
    })
  }

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setAppTitle(useFormatMessage("modules.workspace.title.workgroup_manage")))
  }, [])

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.filter])

  useEffect(() => {
    if (state.loading === false) {
      setState({
        disableLoadMore: state.filter.page >= state.totalPage
      })
    }
  }, [state.loading, state.filter])

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
        <div></div>
      </div>
      <div className="body">
        <WorkspaceManaged
          workspaceType="manage"
          loading={state.loading}
          loadingPaginate={state.loadingPaginate}
          data={state.data}
          showSeeAll={false}
          showBack={true}
          showLoadMore={state.showLoadMore}
          disableLoadMore={state.disableLoadMore}
          handleCLickLoadMore={handleCLickLoadMore}
        />
      </div>
    </div>
  )
}

export default WorkspaceManagedPage
