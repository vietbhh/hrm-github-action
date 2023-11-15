// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
// ** Components
import WorkspaceManaged from "../components/detail/ListWorkSpace/WorkspaceManaged"
import WorkspaceFilter from "../components/detail/ListWorkSpace/WorkspaceFilter"
import CreateWorkgroupModal from "../components/modals/CreateWorkgroupModal/CreateWorkgroupModal"
import { useDispatch } from "react-redux"
import { setAppTitle } from "../../../redux/app/app"
import { ErpInput } from "@apps/components/common/ErpField"

const ListWorkspace = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    dataManage: [],
    dataJoined: [],
    modal: false,
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

  const toggleModal = () => {
    setState({
      modal: !state.modal
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
  const dispatch = useDispatch()
  // ** effect
  useEffect(() => {
    loadData()
    dispatch(setAppTitle("Workgroups"))
  }, [])

  useEffect(() => {
    loadData()
  }, [state.filter.text.length])

  // ** render
  const renderCreateWorkgroupModal = () => {
    if (state.modal) {
      return (
        <CreateWorkgroupModal modal={state.modal} handleModal={toggleModal} />
      )
    }

    return ""
  }

  return (
    <Fragment>
      <div className="pt-0 pb-1 list-workspace-page">
        <WorkspaceFilter
          filter={state.filter}
          setFilter={setFilter}
          toggleModal={toggleModal}
        />
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
      <Fragment>{renderCreateWorkgroupModal()}</Fragment>
    </Fragment>
  )
}

export default ListWorkspace
