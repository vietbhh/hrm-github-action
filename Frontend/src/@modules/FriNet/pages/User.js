import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { userApi } from "../common/api"
import Introduction from "../components/User/Introduction/Introduction"
import TimeLine from "../components/User/Timeline/Timeline"
import WorkSpace from "../components/User/Workspace/Workspace"
import Photo from "../components/User/Photo/Photo"
import { workspaceApi } from "@modules/Workspace/common/api"
import "../assets/scss/user.scss"
import { Skeleton } from "antd"
import PageHeader from "../components/User/PageHeader/PageHeader"
import { TabContent, TabPane } from "reactstrap"
import { getTabId } from "@modules/FriNet/common/common"
import { useSelector } from "react-redux"

const User = () => {
  const params = useParams()
  const tab = getTabId(params.tab)

  if (tab === "") {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

  const [state, setState] = useMergedState({
    loading: true,
    employeeData: {},
    tabActive: tab
  })

  const userAuth = useSelector((state) => state.auth.userData)

  const navigate = useNavigate()
  const identity = params.identity === "profile" ? userAuth.id : params.identity

  if (_.isEmpty(identity)) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

  const setTabActive = (tabId) => {
    setState({
      tabActive: getTabId(tabId)
    })
    window.history.replaceState(null, "", `/u/${identity === "profile" ? "profile" : params.identity}/${tabId}`)
  }

  const loadData = async () => {
    setState({
      loading: true
    })
    await userApi
      .getUser(identity)
      .then((res) => {
        setState({
          employeeData: res.data,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          employeeData: {},
          loading: false
        })
        navigate("/not-found", { replace: true })
      })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setState({
      tabActive: tab
    })
  }, [params])

  // ** render
  const renderComponent = () => {
    if (state.loading) {
      return (
        <div className="feed">
          <div className="load-feed">
            <div className="div-loading">
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="user-profile-page">
        <PageHeader
          identity={identity}
          employeeData={state.employeeData}
          tabActive={state.tabActive}
          setTabActive={setTabActive}
        />

        <div className="mt-1">
          <TabContent className="py-50" activeTab={state.tabActive}>
            <TabPane tabId={1}>
              <TimeLine employeeData={state.employeeData} />
            </TabPane>
            <TabPane tabId={2}>
              <Introduction
                employeeData={state.employeeData}
                loadData={loadData}
                isProfile={state.employeeData.is_profile}
              />
            </TabPane>
            <TabPane tabId={3}>
              <WorkSpace
                identity={identity}
                employeeData={state.employeeData}
              />
            </TabPane>
            <TabPane tabId={4}>
              <Photo identity={identity} />
            </TabPane>
          </TabContent>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default User
