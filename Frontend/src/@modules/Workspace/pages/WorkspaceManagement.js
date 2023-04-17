// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "../common/api"
import moment from "moment"
// ** Styles
// ** Components
import HeaderComponent from "../components/detail/WorkspaceManagement/HeaderComponent"
import WorkspaceOverview from "../components/detail/WorkspaceManagement/Overview/WorkspaceOverview"
import ListWorkspace from "../components/detail/WorkspaceManagement/List/ListWorkspace"

const WorkspaceManagement = () => {
  const [state, setState] = useMergedState({
    loading: false,
    loadingOverview: false,
    data: [],
    dataOverview: [],
    totalData: 0,
    filterOverview: {
      from: moment().subtract(1, "month"),
      to: moment()
    },
    filter: {
      page: 1,
      limit: 20,
      status: "all",
      text: "",
      from: moment().subtract(1, "month"),
      to: moment(),
      query_type: "information"
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

  const setFilterOverview = (obj) => {
    setState({
      filterOverview: {
        ...state.filter,
        ...obj
      }
    })
  }

  const loadData = () => {
    setState({
      loading: true
    })

    const params = {
      ...state.filter,
      workspace_type: "",
      from: state.filterOverview.from.format("YYYY-MM-DD"),
      to: state.filterOverview.to.format("YYYY-MM-DD")
    }
    workspaceApi
      .getList(params)
      .then((res) => {
        setTimeout(() => {
          setState({
            loading: false,
            data: res.data.results,
            totalData: res.data.total_data
          })
        }, 500)
      })
      .catch((err) => {
        setState({
          data: state.data,
          totalData: state.totalData,
          loading: false
        })
      })
  }

  const loadDataOverview = () => {
    setState({
      loadingOverview: true
    })

    const params = {
      ...state.filterOverview,
      from: state.filterOverview.from.format("YYYY-MM-DD"),
      to: state.filterOverview.to.format("YYYY-MM-DD")
    }
    workspaceApi
      .getOverview(params)
      .then((res) => {
        setState({
          dataOverview: res.data,
          loadingOverview: false
        })
      })
      .catch((err) => {
        setState({
          dataOverview: state.dataOverview,
          loadingOverview: false
        })
      })
  }

  const setData = (data) => {
    setState({
      data: data
    })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.filter])

  useEffect(() => {
    loadDataOverview()
  }, [state.filterOverview])

  // ** render
  return (
    <div className="workspace-management-page">
      <HeaderComponent filter={state.filter} setFilter={setFilter} />
      <WorkspaceOverview
        loading={state.loadingOverview}
        data={state.dataOverview}
        filterOverview={state.filterOverview}
        setFilterOverview={setFilterOverview}
      />
      <ListWorkspace
        loading={state.loading}
        data={state.data}
        totalData={state.totalData}
        filter={state.filter}
        setFilter={setFilter}
        setData={setData}
      />
    </div>
  )
}

export default WorkspaceManagement
