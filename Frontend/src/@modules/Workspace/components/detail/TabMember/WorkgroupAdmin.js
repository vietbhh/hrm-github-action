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
    // ** methods
    setIsReloadAdmin
  } = props

  const [state, setState] = useMergedState({
    loading: true,
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
    setState({
      loading: true
    })

    workspaceApi
      .loadDataMember(id, params)
      .then((res) => {
        setState({
          totalListAdmin: res.data.total_list_admin,
          administrators: reset
            ? [...res.data.administrators]
            : [...state.administrators, ...res.data.administrators],
          loading: false
        })
        setIsReloadAdmin(false)
      })
      .catch((err) => {
        setState({
          totalListAdmin: 0,
          administrators: [],
          loading: false
        })
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
    loadData()
  }, [state.filter])

  useEffect(() => {
    if (isReloadAdmin === true) {
      loadData(true)
    }
  }, [isReloadAdmin])

  useEffect(() => {
    if (state.loading === false) {
      setState({
        disableLoadMore:
          state.filter.page >= state.totalListAdmin / state.filter.limit
      })
    }
  }, [state.loading, state.filter])

  // ** render
  const renderComponent = () => {
    return (
      <div className="section">
        <div className="w-100 admin-section">
          <h6 className="title mb-1">
            {useFormatMessage("modules.workspace.text.admin_and_moderators")}
          </h6>
          <div className="w-100 d-flex align-items-center justify-content-start pt-25">
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
              setPagination={setFilter}
              handleClickLoadMore={handleClickLoadMore}
              loadData={loadData}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardBody className="pb-75 pt-75">
        <Fragment>{renderComponent()}</Fragment>
      </CardBody>
    </Card>
  )
}

export default WorkgroupAdmin
