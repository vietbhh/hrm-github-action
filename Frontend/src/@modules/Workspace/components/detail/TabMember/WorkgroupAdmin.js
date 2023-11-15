// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import AppSpinner from "@apps/components/spinner/AppSpinner"
import ListMember from "./ListMember"

const WorkgroupAdmin = (props) => {
  const {
    // ** props
    id,
    userState,
    isReloadAdmin,
    isAdminGroup,
    detailWorkspace,
    isLoadable,
    // ** methods
    setIsReloadAdmin,
    setDetailWorkspace
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    loadingAll: false,
    administrators: [],
    totalListAdmin: 0,
    disableLoadMore: false,
    filter: {
      page: 1,
      limit: 5
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

  const params = {
    ...state.filter,
    page: state.filter.page,
    limit: state.filter.limit,
    load_list: "admin"
  }

  const loadData = (reset = false) => {
    const loadingState = reset === true ? "loadingAll" : "loading"

    setState({
      [loadingState]: true
    })

    workspaceApi
      .loadDataMember(id, params)
      .then((res) => {
        setState({
          totalListAdmin: res.data.total_list_admin,
          administrators: reset
            ? [...res.data.administrators]
            : [...state.administrators, ...res.data.administrators]
        })
        setTimeout(() => {
          setState({
            [loadingState]: false
          })
        }, 600)
        setIsReloadAdmin(false)
      })
      .catch((err) => {
        setState({
          totalListAdmin: 0,
          administrators: []
        })
        setTimeout(() => {
          setState({
            [loadingState]: false
          })
        }, 600)
        setIsReloadAdmin(false)
      })
  }

  const handleClickLoadMore = () => {
    setFilter({
      page: state.filter.page + 1
    })
  }

  // ** effect
  useEffect(() => {
    if (isLoadable === true) {
      loadData()
    }
  }, [state.filter])

  useEffect(() => {
    if (isReloadAdmin === true) {
      loadData(true)
    }
  }, [isReloadAdmin])

  useEffect(() => {
    if (isLoadable === true) {
      loadData(true)
    }
  }, [isLoadable, detailWorkspace])

  useEffect(() => {
    if (state.loading === false) {
      setState({
        disableLoadMore:
          state.filter.page >= state.totalListAdmin / state.filter.limit
      })
    }
  }, [state.loading, state.filter])

  // ** render
  const renderLoadingComponent = () => {
    return (
      <div className="w-100 loading-member-component">
        <AppSpinner />
      </div>
    )
  }

  const renderBody = () => {
    if (state.loadingAll === true) {
      return (
        <div className="w-100 loading-member-component">
          <AppSpinner />
        </div>
      )
    }

    return (
      <div className="w-100 d-flex align-items-center justify-content-start">
        <ListMember
          id={id}
          userState={userState}
          isAdmin={true}
          isAdminGroup={isAdminGroup}
          loadingWorkgroup={state.loading}
          listData={state.administrators}
          totalListData={state.totalListAdmin}
          currentPage={state.filter.page}
          perPage={state.filter.limit}
          disableLoadMore={state.disableLoadMore}
          handleClickLoadMore={handleClickLoadMore}
          loadData={loadData}
          setDetailWorkspace={setDetailWorkspace}
        />
      </div>
    )
  }

  return (
    <Card>
      <CardBody>
        <div className="section">
          <div className="w-100 admin-section">
            <h6 className="title">
              {useFormatMessage("modules.workspace.text.admin_and_moderators")}
            </h6>
            <div>
              <Fragment>{renderBody()}</Fragment>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default WorkgroupAdmin
