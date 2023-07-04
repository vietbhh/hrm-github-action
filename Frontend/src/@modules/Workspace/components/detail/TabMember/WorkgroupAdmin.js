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
    loadingTabMember,
    isAdminGroup
    // ** methods
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

  const loadData = () => {
    setState({
      loading: true
    })

    workspaceApi
      .loadDataMember(id, params)
      .then((res) => {
        setState({
          totalListAdmin: res.data.total_list_admin,
          administrators: [...state.administrators, ...res.data.administrators],
          loading: false
        })
      })
      .catch((err) => {
        setState({
          totalListAdmin: 0,
          administrators: [],
          loading: false
        })
      })
  }

  const handleClickLoadMore = () => {
    setFilter({
      page: state.filter.page + 1
    })
  }

  // ** effect
  useEffect(() => {
    if (loadingTabMember === false && state.administrators.length === 0) {
      loadData()
    }
  }, [loadingTabMember])

  useEffect(() => {
    loadData()
  }, [state.filter])

  useEffect(() => {
    if (loadingTabMember === false && state.loading === false) {
      setState({
        disableLoadMore:
          state.filter.page >= state.totalListAdmin / state.filter.limit
      })
    }
  }, [loadingTabMember, state.loading, state.filter])

  // ** render
  const renderComponent = () => {
    if (loadingTabMember === true) {
      return (
        <div className="d-flex align-items-center justify-content-center loading-component">
          <AppSpinner />
        </div>
      )
    }

    return (
      <Card>
        <CardBody className="pb-75 pt-75">
          <div className="section">
            <div className="w-100 admin-section">
              <h6 className="title mb-1">
                {useFormatMessage(
                  "modules.workspace.text.admin_and_moderators"
                )}
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
        </CardBody>
      </Card>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default WorkgroupAdmin
