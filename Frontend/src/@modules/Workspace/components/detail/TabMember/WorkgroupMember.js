// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect, useMemo } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import AppSpinner from "@apps/components/spinner/AppSpinner"
import HeaderSection from "./HeaderSection"
import ListMember from "./ListMember"

const WorkgroupMember = (props) => {
  const {
    // ** props
    id,
    userState,
    isAdminGroup,
    // ** methods
    setIsReloadAdmin
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    totalMember: 0,
    totalListMember: 0,
    members: [],
    disableLoadMore: false,
    searchText: "",
    filter: {
      page: 1,
      limit: 10
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

  const setSearchText = (str) => {
    setState({
      searchText: str
    })
  }

  const params = {
    ...state.filter,
    text: state.searchText,
    load_list: "member"
  }

  const loadData = (reset = false) => {
    setState({
      loading: true
    })

    workspaceApi
      .loadDataMember(id, params)
      .then((res) => {
        setState({
          totalMember: res.data.total_member,
          totalListMember: res.data.total_list_member,
          members: reset
            ? [...res.data.members]
            : [...state.members, ...res.data.members]
        })

        setTimeout(() => {
          setState({
            loading: false
          })
        }, 600)
      })
      .catch((err) => {
        setState({
          totalMember: 0,
          totalListMember: 0,
          members: []
        })

        setTimeout(() => {
          setState({
            loading: false
          })
        }, 600)
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
    loadData(true)
  }, [state.searchText])

  useEffect(() => {
    if (state.loading === false) {
      setState({
        disableLoadMore:
          state.filter.page >= state.totalListMember / state.filter.limit
      })
    }
  }, [state.loading, state.filter])

  // ** render
  const renderComponent = () => {
    return (
      <Fragment>
        <div className="section border-bot">
          <HeaderSection
            totalMember={state.totalMember}
            filter={state.filter}
            setSearchText={setSearchText}
          />
        </div>
        <div className="section mt-50">
          <div className="w-100 member-section">
            <div className="w-100 d-flex align-items-center justify-content-start">
              <ListMember
                id={id}
                userState={userState}
                isAdmin={false}
                isAdminGroup={isAdminGroup}
                loadingWorkgroup={state.loading}
                listData={state.members}
                totalListData={state.totalListMember}
                currentPage={state.filter.page}
                perPage={state.filter.limit}
                disableLoadMore={state.disableLoadMore}
                setPagination={setFilter}
                handleClickLoadMore={handleClickLoadMore}
                loadData={loadData}
                setIsReloadAdmin={setIsReloadAdmin}
              />
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <Card>
      <CardBody>
        <Fragment>{renderComponent()}</Fragment>
      </CardBody>
    </Card>
  )
}

export default WorkgroupMember
