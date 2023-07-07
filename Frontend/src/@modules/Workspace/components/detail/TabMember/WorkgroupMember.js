// ** React Imports
import { useMergedState, useFormatMessage } from "@apps/utility/common"
import { Fragment, useEffect, useMemo } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import AppSpinner from "@apps/components/spinner/AppSpinner"
import HeaderSection from "./HeaderSection"
import ListMember from "./ListMember"
import { EmptyContent } from "@apps/components/common/EmptyContent"

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
  const renderListMember = () => {
    if (state.members.length === 0) {
      return (
        <div className="empty-member pt-1 w-100">
          <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-2">
            <EmptyContent
              className="custom-empty-content empty-post"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="146px"
                  height="150px"
                  viewBox="0 0 146 150"
                  enableBackground="new 0 0 146 150"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="146"
                    height="150"
                    x="0"
                    y="0"
                    href="data:image/png;base64,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 KzAyOjAwGQqG4QAAAABJRU5ErkJggg=="
                  />
                </svg>
              }
              title={useFormatMessage(
                "modules.workspace.display.empty_member.title"
              )}
              text=""
            />
          </div>
        </div>
      )
    }

    return (
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
    )
  }

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
              <Fragment>{renderListMember()}</Fragment>
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
