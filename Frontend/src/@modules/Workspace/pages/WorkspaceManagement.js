// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "../common/api"
import moment from "moment"
// ** Styles
// ** Components
import HeaderComponent from "../components/detail/WorkspaceManagement/HeaderComponent"
import TableWorkspace from "../components/detail/WorkspaceManagement/TableWorkspace"
import WorkspaceOverview from "../components/detail/WorkspaceManagement/Overview/WorkspaceOverview"

const WorkspaceManagement = () => {
  const [state, setState] = useMergedState({
    loading: false,
    loadingOverview: false,
    data: [],
    dataOverview: [],
    totalData: 0,
    filterOverview: {
      from: moment().startOf("month").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD")
    },
    filter: {
      page: 1,
      limit: 20,
      status: "all",
      text: "",
      from: moment().startOf("month").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD")
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

    const params = { ...state.filter, workspace_type: "" }
    workspaceApi
      .getList(params)
      .then((res) => {
        setState({
          data: res.data.results,
          totalData: res.data.total_data,
          loading: false
        })
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

    const params = state.filterOverview
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  // ** render
  return (
    <div className="workspace-management-page">
      <HeaderComponent filter={state.filter} setFilter={setFilter} />
      <WorkspaceOverview
        data={state.dataOverview}
        filterOverview={state.filterOverview}
        setFilterOverview={setFilterOverview}
      />
      <TableWorkspace
        data={state.data}
        totalData={state.totalData}
        filter={state.filter}
        setFilter={setFilter}
      />
    </div>
  )
}

export default WorkspaceManagement
